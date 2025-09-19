'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to admin dashboard
    router.push('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirecting to Admin Dashboard...</h1>
        <p className="text-gray-600">Please wait...</p>
        </div>
    </div>
  );
};

export default Home;