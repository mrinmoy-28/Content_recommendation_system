import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Plus } from 'lucide-react';
import { Content } from '../../types';
import Button from '../ui/Button';

interface HeroSectionProps {
  content: Content;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={content.backdrop} 
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20">
        <div className="max-w-lg animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{content.title}</h1>
          
          <div className="flex items-center text-gray-300 mb-4 text-sm">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded mr-2">
              {content.rating.toFixed(1)}
            </span>
            <span>{content.releaseYear}</span>
            <span className="mx-2">•</span>
            <span>{content.type === 'movie' ? `${content.duration} min` : `${content.duration} seasons`}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {content.genres.map((genre, index) => (
              <span 
                key={index}
                className="bg-background-light/60 px-2 py-1 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-gray-300 mb-6 line-clamp-3">{content.description}</p>
          
          <div className="flex flex-wrap gap-3">
            <Link to={`/content/${content.id}`}>
              <Button variant="primary" size="md" className="flex items-center">
                <Play size={18} className="mr-2" /> Watch Now
              </Button>
            </Link>
            <Link to={`/content/${content.id}`}>
              <Button variant="secondary" size="md" className="flex items-center">
                <Info size={18} className="mr-2" /> More Info
              </Button>
            </Link>
            <Button variant="ghost" size="md" className="flex items-center">
              <Plus size={18} className="mr-2" /> Add to List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;