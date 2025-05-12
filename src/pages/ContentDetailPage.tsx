import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Play, Plus, Share, Star, Clock } from 'lucide-react';

import Button from '../components/ui/Button';
import ContentCarousel from '../components/ui/ContentCarousel';

import { 
  fetchContentByIdAtom,
  selectedContentAtom,
  contentLoadingAtom,
  contentListAtom
} from '../store/content';

import {
  authStateAtom
} from '../store/auth';

import {
  addToHistoryAtom,
  updateHistoryAtom,
  viewingHistoryAtom
} from '../store/history';

const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ isAuthenticated, user }] = useAtom(authStateAtom);
  const [selectedContent] = useAtom(selectedContentAtom);
  const [isLoading] = useAtom(contentLoadingAtom);
  const [allContent] = useAtom(contentListAtom);
  const [viewingHistory] = useAtom(viewingHistoryAtom);
  const [, fetchContentById] = useAtom(fetchContentByIdAtom);
  const [, addToHistory] = useAtom(addToHistoryAtom);
  const [, updateHistory] = useAtom(updateHistoryAtom);
  
  const [showTrailer, setShowTrailer] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchContentById(id);
      window.scrollTo(0, 0);
    }
  }, [id, fetchContentById]);
  
  // Find similar content
  const similarContent = selectedContent
    ? selectedContent.similarContent
        .map(similarId => allContent.find(content => content.id === similarId))
        .filter(Boolean)
    : [];
  
  // Find viewing history for this content
  const contentHistory = isAuthenticated && selectedContent
    ? viewingHistory.find(h => h.contentId === selectedContent.id)
    : null;
  
  const handleWatchNow = () => {
    if (!isAuthenticated || !user || !selectedContent) return;
    
    if (contentHistory) {
      // Update existing history
      updateHistory({
        id: contentHistory.id,
        watchedPercentage: 10, // Start from beginning or continue
        completed: false
      });
    } else {
      // Add new history entry
      addToHistory({
        contentId: selectedContent.id,
        watchedPercentage: 10,
        completed: false
      });
    }
    
    // Logic to play content would go here
    // For MVP, just showing trailer
    setShowTrailer(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!selectedContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Content Not Found</h2>
        <p className="text-gray-400 mb-6">The content you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse">
          <Button variant="primary">Browse Content</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Banner with Backdrop */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {/* Backdrop Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img 
            src={selectedContent.backdrop} 
            alt={selectedContent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
        </div>
        
        {/* Content Details */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              <img 
                src={selectedContent.poster} 
                alt={selectedContent.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Details */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{selectedContent.title}</h1>
              
              <div className="flex items-center text-gray-300 mb-4">
                <span className="bg-primary-600 text-white px-2 py-0.5 rounded mr-2">
                  {selectedContent.rating.toFixed(1)}
                </span>
                <span>{selectedContent.releaseYear}</span>
                <span className="mx-2">•</span>
                <span>
                  {selectedContent.type === 'movie' 
                    ? `${selectedContent.duration} min` 
                    : `${selectedContent.duration} seasons`
                  }
                </span>
                
                {contentHistory && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="flex items-center text-primary-400">
                      <Clock size={14} className="mr-1" />
                      {contentHistory.completed 
                        ? 'Watched' 
                        : `${contentHistory.watchedPercentage}% complete`
                      }
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedContent.genres.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-background-light/60 px-2 py-1 text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-6">{selectedContent.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  size="md" 
                  className="flex items-center"
                  onClick={handleWatchNow}
                >
                  <Play size={18} className="mr-2" /> Watch Now
                </Button>
                <Button variant="secondary" size="md" className="flex items-center">
                  <Plus size={18} className="mr-2" /> Add to List
                </Button>
                <Button variant="ghost" size="md" className="flex items-center">
                  <Share size={18} className="mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trailer section (simplified) */}
        {showTrailer && selectedContent.trailerUrl && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Trailer</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <iframe
                src={selectedContent.trailerUrl}
                title={`${selectedContent.title} Trailer`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Cast and Crew */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Cast & Crew</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-background-light rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Director</h3>
              <div className="text-gray-400">
                {selectedContent.directors.map((director, index) => (
                  <div key={index}>{director}</div>
                ))}
              </div>
            </div>
            
            {selectedContent.cast.slice(0, 5).map((actor, index) => (
              <div key={index} className="bg-background-light rounded-lg p-4">
                <div className="text-gray-300">{actor}</div>
                <div className="text-xs text-gray-500">Actor</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Similar Content */}
        {similarContent.length > 0 && (
          <div className="mb-8">
            <ContentCarousel 
              title="More Like This" 
              contents={similarContent} 
            />
          </div>
        )}
        
        {/* Ratings and Reviews (placeholder for MVP) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">Ratings & Reviews</h2>
            <Button variant="ghost" size="sm">
              Write a Review
            </Button>
          </div>
          
          <div className="bg-background-light rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold text-primary-400">{selectedContent.rating.toFixed(1)}</div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <div className="text-sm text-gray-400 w-16">5 stars</div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1">
                  <div className="text-sm text-gray-400 w-16">4 stars</div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1">
                  <div className="text-sm text-gray-400 w-16">3 stars</div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <div className="flex items-center mb-1">
                  <div className="text-sm text-gray-400 w-16">2 stars</div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '3%' }}></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-400 w-16">1 star</div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '2%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Placeholder review */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white">
                  U
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">User123</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={14} 
                          className={i < 4 ? "text-yellow-500 fill-current" : "text-gray-600"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 mt-1">
                    Great {selectedContent.type === 'movie' ? 'movie' : 'show'}! The story was compelling and the characters were well developed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;