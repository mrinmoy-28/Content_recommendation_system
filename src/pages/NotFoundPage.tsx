import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Film className="h-20 w-20 text-primary-500 mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" className="flex items-center">
          <Home size={18} className="mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;