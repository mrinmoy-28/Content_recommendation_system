import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { Content } from '../../types';

interface ContentCarouselProps {
  title: string;
  contents: Array<Content | (Content & { progress?: number })>;
  isContinueWatching?: boolean;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ 
  title, 
  contents, 
  isContinueWatching = false 
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = current.clientWidth * 0.8;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (contents.length === 0) {
    return null;
  }

  return (
    <div className="my-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-1 rounded-full bg-background-light hover:bg-primary-700 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-1 rounded-full bg-background-light hover:bg-primary-700 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="content-carousel flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4"
      >
        {contents.map((content) => (
          <div key={content.id} className="flex-shrink-0 w-[180px]">
            <ContentCard 
              content={content}
              isContinueWatching={isContinueWatching}
              progress={'progress' in content ? content.progress : 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentCarousel;