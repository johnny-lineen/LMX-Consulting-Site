import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const ConsultantPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /bot page where the chatbot is now located
    router.replace('/bot');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to chatbot...</p>
      </div>
    </div>
  );
};

export default ConsultantPage;
