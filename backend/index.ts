import express from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT || '8080');

// ✅ Setup CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'ngrok-skip-browser-warning',
    'Origin',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

// ✅ Extra manual CORS headers (for full ESP8266 compatibility)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept, Origin, X-Requested-With, ngrok-skip-browser-warning');
  res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    console.log('🔄 Preflight OPTIONS request handled');
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

/* 🧠 In-memory data */
interface User {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

interface Ride {
  device: string;
  pickup: string;
  destination: string;
  fare: string;
  lat?: number;
  lng?: number;
  timestamp: number;
  type?: string;
}

const users: User[] = [];
let latestRide: Ride | null = null;
const rideStatusMap: Record<string, 'pending' | 'accepted' | 'rejected'> = {};

/* 👤 Routes */

app.get('/', (_req, res) => {
  res.send('🚀 Backend is running!');
});

// ✅ Signup
app.post('/signup', (req, res) => {
  const { name, email, phone, username, password } = req.body;

  if (!name || !email || !phone || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = { name, email, phone, username, password };
  users.push(newUser);

  console.log('👤 New user signed up:', newUser);
  res.status(201).json({ message: 'Signup successful', user: newUser });
});

// ✅ Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  console.log('✅ User logged in:', user.username);
  res.json({ message: 'Login successful', user });
});

// ✅ Book Ride
app.post('/api/book-ride', (req, res) => {
  const { device, pickup, destination, lat, lng, type } = req.body;

  if (!device || !pickup || !destination) {
    return res.status(400).json({ message: 'Missing fields in request' });
  }

  const rideType = (type || 'shared').toLowerCase();
  const fare = rideType === 'private' ? '₹180' : '₹120';

  latestRide = {
    device,
    pickup,
    destination,
    fare,
    lat,
    lng,
    timestamp: Date.now(),
    type: rideType,
  };

  rideStatusMap[device] = 'pending';

  console.log('📦 New ride request received:', latestRide);

  res.status(200).json({
    message: 'Ride request received',
    from: pickup,
    to: destination,
    fare,
    driverNearby: true,
  });
});

// ✅ Get Latest Ride
app.get('/api/latest-ride', (_req, res) => {
  if (latestRide) {
    console.log('📤 Sending latest ride:', latestRide);
    return res.json(latestRide);
  } else {
    console.log('ℹ️ No new ride available');
    return res.sendStatus(204);
  }
});

// ✅ Accept Ride
app.post('/api/ride-accept', (req, res) => {
  const { device } = req.body;

  if (!latestRide || latestRide.device !== device) {
    console.log('❌ No matching ride to accept');
    return res.status(404).json({ message: 'No matching ride to accept' });
  }

  console.log(`✅ Ride accepted by device: ${device}`);
  rideStatusMap[device] = 'accepted';
  latestRide = null;

  res.json({ message: 'Ride accepted' });
});

// ✅ Reject Ride
app.post('/api/ride-reject', (req, res) => {
  const { device } = req.body;

  if (!latestRide || latestRide.device !== device) {
    console.log('❌ No matching ride to reject');
    return res.status(404).json({ message: 'No matching ride to reject' });
  }

  console.log(`❌ Ride rejected by device: ${device}`);
  rideStatusMap[device] = 'rejected';
  latestRide = null;

  res.json({ message: 'Ride rejected' });
});

// ✅ Ride Status Polling for ESP8266
app.get('/api/ride-status/:device', (req, res) => {
  const { device } = req.params;
  const status = rideStatusMap[device];

  if (!status) {
    return res.json({ status: 'none' }); // no request sent yet
  }

  return res.json({ status });
});

// ✅ Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});