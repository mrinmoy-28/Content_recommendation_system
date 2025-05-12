import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Mail, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark border-t border-gray-800 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">StreamAI</span>
            </Link>
            <p className="mt-2 text-sm">
              Personalized streaming recommendations powered by AI. Find your next favorite show or movie with StreamAI.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="hover:text-primary-400">Home</Link></li>
              <li><Link to="/browse" className="hover:text-primary-400">Browse</Link></li>
              <li><Link to="/search" className="hover:text-primary-400">Search</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="#" className="hover:text-primary-400">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary-400">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary-400">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h3>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary-400" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-center text-sm">&copy; {new Date().getFullYear()} StreamAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;