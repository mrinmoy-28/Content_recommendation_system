import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Content } from '../../types';

interface ContentCardProps {
  content: Content;
  showRating?: boolean;
  isContinueWatching?: boolean;
  progress?: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  showRating = true, 
  isContinueWatching = false,
  progress = 0
}) => {
  return (
    <Link to={`/content/${content.id}`} className="group">
      <div className="content-card relative w-full aspect-[2/3] overflow-hidden rounded-lg">
        {/* Poster Image */}
        <img 
          src={content.poster} 
          alt={content.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Continue Watching Progress Bar */}
        {isContinueWatching && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-primary-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="text-sm font-semibold line-clamp-1 mb-1 group-hover:text-primary-400 transition-colors">
            {content.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs">
            <span>{content.releaseYear}</span>
            
            {showRating && (
              <div className="flex items-center">
                <Star size={12} className="text-yellow-500 mr-1" fill="currentColor" />
                <span>{content.rating.toFixed(1)}</span>
              </div>
            )}
            
            {isContinueWatching && (
              <div className="flex items-center">
                <Clock size={12} className="text-primary-400 mr-1" />
                <span>Continue</span>
              </div>
            )}
          </div>
          
          {/* Genres tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {content.genres.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="text-[10px] bg-background-light px-1.5 py-0.5 rounded-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;