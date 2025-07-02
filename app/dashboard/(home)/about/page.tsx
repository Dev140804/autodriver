'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function About() {
  const [driver, setDriver] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('driver-user');
    if (data) setDriver(JSON.parse(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('driver-session');
    router.push('/driver-login');
  };

  return (
    <div className="p-4 text-white bg-gray-900 h-full">
      <h1 className="text-2xl mb-4">Driver Profile</h1>
      {driver ? (
        <div>
          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Email:</strong> {driver.email}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 p-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>No driver data found.</p>
      )}
    </div>
  );
}