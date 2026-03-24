import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
// ================== CONFIG ==================
const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);
// ================== CORS ==================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'ngrok-skip-browser-warning',
        'Origin',
        'X-Requested-With',
        'Accept',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
}));
// Extra manual CORS (for ESP8266)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, ngrok-skip-browser-warning');
    res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        console.log('🔄 Preflight OPTIONS request handled');
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json());
// ================== STATE ==================
const users = [];
const onlineDrivers = new Set();
const rides = [];
let latestRide = null; // Legacy (ESP)
const rideStatusMap = {};
const rideAcceptedBy = {};
// ================== HELPERS ==================
function getOnlineDriverNames() {
    return [...onlineDrivers];
}
// Fisher–Yates shuffle
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function getCurrentOfferedDriver(ride) {
    if (ride.currentIdx < 0 || ride.currentIdx >= ride.candidates.length)
        return null;
    return ride.candidates[ride.currentIdx];
}
// find next driver index in the current round
function findNextIdxInCurrentRound(ride) {
    for (let i = ride.currentIdx + 1; i < ride.candidates.length; i++) {
        const d = ride.candidates[i];
        if (!onlineDrivers.has(d))
            continue;
        if (ride.rejectedForever[d])
            continue; // hard rejected
        if (ride.skippedThisRound[d])
            continue; // already tried this round (timed out)
        return i;
    }
    return -1;
}
function offerToDriver(ride, driverName, ttlMs = 5000) {
    ride.offerExpiresAt = Date.now() + ttlMs;
    ride.status = 'searching';
    ride.acceptedBy = undefined;
    console.log(`📨 Offering ride ${ride.rideId} (round ${ride.round}) to ${driverName} until ${ride.offerExpiresAt}`);
}
function startNewRoundIfPossible(ride) {
    // rebuild candidate list with currently online & not-hard-rejected drivers
    const fresh = getOnlineDriverNames().filter((d) => !ride.rejectedForever[d]);
    if (fresh.length === 0)
        return false;
    ride.round += 1;
    ride.skippedThisRound = {}; // clear timeouts
    ride.candidates = shuffle(fresh); // reshuffle so order changes each round
    ride.currentIdx = -1;
    console.log(`🔁 Starting round ${ride.round} for ride ${ride.rideId}`);
    return true;
}
function advanceRideToNextDriver(ride) {
    // try to find next driver in the current round
    let nextIdx = findNextIdxInCurrentRound(ride);
    // if none, try to start a new round and search again
    if (nextIdx === -1) {
        const started = startNewRoundIfPossible(ride);
        if (!started) {
            ride.status = 'exhausted';
            ride.offerExpiresAt = undefined;
            rideStatusMap[ride.device] = 'rejected';
            console.log(`❌ Ride ${ride.rideId} exhausted. No driver accepted.`);
            return;
        }
        nextIdx = findNextIdxInCurrentRound(ride);
        if (!started) {
            // Restart from the first available online driver
            const onlineList = getOnlineDriverNames().filter(d => !ride.rejectedForever[d]);
            if (onlineList.length > 0) {
                ride.candidates = shuffle(onlineList);
                ride.currentIdx = 0;
                ride.skippedThisRound = {};
                ride.round++;
                offerToDriver(ride, ride.candidates[0]);
                console.log(`🔄 Restarting offers for ride ${ride.rideId}`);
            }
            else {
                // No drivers at all
                ride.status = 'exhausted';
                ride.offerExpiresAt = undefined;
                rideStatusMap[ride.device] = 'rejected';
                console.log(`❌ Ride ${ride.rideId} exhausted. No driver online.`);
            }
            return;
        }
    }
    ride.currentIdx = nextIdx;
    const nextDriver = ride.candidates[nextIdx];
    offerToDriver(ride, nextDriver);
}
function tickRides() {
    const now = Date.now();
    for (const ride of rides) {
        if (ride.status !== 'searching')
            continue;
        const currentDriver = getCurrentOfferedDriver(ride);
        if (!currentDriver) {
            ride.status = 'exhausted';
            ride.offerExpiresAt = undefined;
            rideStatusMap[ride.device] = 'rejected';
            continue;
        }
        if (ride.offerExpiresAt && now > ride.offerExpiresAt) {
            console.log(`⏱️ Offer expired for ${currentDriver} on ride ${ride.rideId}`);
            ride.skippedThisRound[currentDriver] = true; // can be retried next round
            advanceRideToNextDriver(ride);
        }
    }
}
setInterval(tickRides, 1000);
// ================== ROUTES ==================
// Root
app.get('/', (_req, res) => res.send('🚀 Backend is running!'));
// Signup
app.post('/signup', (req, res) => {
    const { name, email, phone, username, password } = req.body;
    if (!name || !email || !phone || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (users.find((u) => u.username === username || u.email === email)) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const newUser = { name, email, phone, username, password };
    users.push(newUser);
    console.log('👤 New user signed up:', newUser);
    return res.status(201).json({ message: 'Signup successful', user: newUser });
});
// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    console.log('✅ User logged in:', user.username);
    return res.json({ message: 'Login successful', user });
});
// Driver Online
app.post('/api/driver-online', (req, res) => {
    const { driverName, online } = req.body;
    if (!driverName)
        return res.status(400).json({ message: 'driverName required' });
    if (online)
        onlineDrivers.add(driverName);
    else
        onlineDrivers.delete(driverName);
    console.log(`🟢 Driver ${driverName} is now ${online ? 'ONLINE' : 'OFFLINE'}`);
    return res.json({ ok: true });
});
// Book Ride
app.post('/api/book-ride', (req, res) => {
    const { device, pickup, destination, lat, lng, type, fare } = req.body;
    if (!device || !pickup || !destination || !fare) {
        return res.status(400).json({ message: 'Missing fields in request' });
    }
    const candidates = shuffle(getOnlineDriverNames());
    latestRide = {
        rideId: randomUUID(),
        device,
        pickup,
        destination,
        fare,
        lat,
        lng,
        timestamp: Date.now(),
        type: (type || 'shared'),
        status: 'searching',
        candidates,
        currentIdx: -1,
        round: 1,
        rejectedForever: {},
        skippedThisRound: {},
    };
    rideStatusMap[device] = 'pending';
    rides.push(latestRide);
    if (latestRide.candidates.length === 0) {
        latestRide.status = 'exhausted';
        rideStatusMap[device] = 'rejected';
        return res.status(200).json({
            message: 'Ride request received (no drivers online)',
            driverNearby: false,
            rideId: latestRide.rideId,
        });
    }
    const firstIdx = 0; // candidates already shuffled
    latestRide.currentIdx = firstIdx;
    offerToDriver(latestRide, latestRide.candidates[firstIdx]);
    return res.status(200).json({
        message: 'Ride request received',
        driverNearby: true,
        rideId: latestRide.rideId,
    });
});
// Latest Ride
app.get('/api/latest-ride', (req, res) => {
    const driverName = req.query.driverName || '';
    if (!driverName) {
        return latestRide ? res.json(latestRide) : res.sendStatus(204);
    }
    const ride = rides.find((r) => r.status === 'searching' && getCurrentOfferedDriver(r) === driverName);
    if (!ride)
        return res.sendStatus(204);
    return res.json(ride);
});
// Accept Ride
app.post('/api/ride-accept', (req, res) => {
    const { rideId, driverName } = req.body;
    const ride = rides.find((r) => r.rideId === rideId);
    if (!ride || ride.status !== 'searching' || getCurrentOfferedDriver(ride) !== driverName) {
        return res.status(400).json({ message: 'Ride not available' });
    }
    if (ride.offerExpiresAt && Date.now() > ride.offerExpiresAt) {
        console.log(`⛔ Accept too late by ${driverName} for ride ${ride.rideId}`);
        ride.skippedThisRound[driverName] = true;
        advanceRideToNextDriver(ride);
        return res.status(408).json({ message: 'Offer expired' });
    }
    ride.status = 'accepted';
    ride.acceptedBy = driverName;
    ride.offerExpiresAt = undefined;
    rideStatusMap[ride.device] = 'accepted';
    rideAcceptedBy[ride.device] = driverName;
    console.log(`✅ Ride ${ride.rideId} accepted by ${driverName}`);
    return res.json({ message: 'Ride accepted', driver: driverName });
});
// Reject Ride
app.post('/api/ride-reject', (req, res) => {
    const { rideId, driverName } = req.body;
    const ride = rides.find((r) => r.rideId === rideId);
    if (!ride || getCurrentOfferedDriver(ride) !== driverName) {
        return res.status(400).json({ message: 'Ride not available' });
    }
    console.log(`❌ ${driverName} rejected ride ${ride.rideId}`);
    ride.rejectedForever[driverName] = true; // never re-offer in this ride
    ride.offerExpiresAt = undefined;
    advanceRideToNextDriver(ride);
    return res.json({ message: 'Ride rejected' });
});
// Ride Timeout
app.post('/api/ride-timeout', (req, res) => {
    const { rideId, driverName } = req.body;
    const ride = rides.find((r) => r.rideId === rideId);
    if (!ride || getCurrentOfferedDriver(ride) !== driverName) {
        return res.status(400).json({ message: 'Ride not available' });
    }
    console.log(`⏱️ Timeout for ${driverName} on ride ${ride.rideId}`);
    ride.skippedThisRound[driverName] = true; // can be re-offered in the next round
    ride.offerExpiresAt = undefined;
    advanceRideToNextDriver(ride);
    return res.json({ ok: true });
});
// Ride Status (ESP)
app.get('/api/ride-status/:device', (req, res) => {
    const { device } = req.params;
    const r = rides.find((x) => x.device === device);
    if (!r) {
        const status = rideStatusMap[device];
        return res.json({ status: status || 'none', driver: rideAcceptedBy[device] });
    }
    return res.json({ status: r.status === 'searching' ? 'pending' : r.status, driver: r.acceptedBy });
});
// ================== START SERVER ==================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
