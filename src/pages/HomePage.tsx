import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import ContentCarousel from '../components/ui/ContentCarousel';
import Button from '../components/ui/Button';
import HeroSection from '../components/sections/HeroSection';

import { 
  fetchContentAtom, 
  fetchGenresAtom,
  trendingContentAtom,
  contentListAtom
} from '../store/content';

import {
  fetchHistoryAtom,
  continueWatchingAtom
} from '../store/history';

import {
  authStateAtom
} from '../store/auth';

import {
  fetchRecommendationsAtom,
  recommendedContentAtom
} from '../store/content';

const HomePage: React.FC = () => {
  const [{ isAuthenticated, user }] = useAtom(authStateAtom);
  const [allContent] = useAtom(contentListAtom);
  const [trendingContent] = useAtom(trendingContentAtom);
  const [continueWatching] = useAtom(continueWatchingAtom);
  const [recommendedContent] = useAtom(recommendedContentAtom);
  
  const [, fetchContent] = useAtom(fetchContentAtom);
  const [, fetchGenres] = useAtom(fetchGenresAtom);
  const [, fetchHistory] = useAtom(fetchHistoryAtom);
  const [, fetchRecommendations] = useAtom(fetchRecommendationsAtom);
  
  // Featured content is the highest rated content
  const featuredContent = allContent.length > 0 
    ? [...allContent].sort((a, b) => b.rating - a.rating)[0] 
    : null;
  
  useEffect(() => {
    fetchContent();
    fetchGenres();
    
    if (isAuthenticated && user) {
      fetchHistory();
      fetchRecommendations(user.id);
    }
  }, [fetchContent, fetchGenres, fetchHistory, fetchRecommendations, isAuthenticated, user]);
  
  // Prepare different categories
  const moviesContent = allContent.filter(item => item.type === 'movie');
  const seriesContent = allContent.filter(item => item.type === 'series');
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredContent && (
        <HeroSection content={featuredContent} />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Continue Watching Section */}
        {isAuthenticated && continueWatching.length > 0 && (
          <ContentCarousel 
            title="Continue Watching" 
            contents={continueWatching.map(item => ({
              ...item.content!,
              progress: item.watchedPercentage
            }))} 
            isContinueWatching={true} 
          />
        )}
        
        {/* Recommended For You Section */}
        {isAuthenticated && recommendedContent.length > 0 && (
          <ContentCarousel 
            title="Recommended For You" 
            contents={recommendedContent} 
          />
        )}
        
        {/* Auth CTA for non-authenticated users */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-primary-900/70 to-background-light/80 rounded-lg p-6 my-8">
            <h2 className="text-2xl font-bold text-white mb-2">Get Personalized Recommendations</h2>
            <p className="text-gray-300 mb-4">Sign up to receive AI-powered recommendations tailored just for you.</p>
            <div className="flex space-x-4">
              <Link to="/register">
                <Button variant="primary">Sign Up Now</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* Trending Now Section */}
        <ContentCarousel 
          title="Trending Now" 
          contents={trendingContent} 
        />
        
        {/* Movies Section */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-white">Movies</h2>
          <Link to="/browse?type=movie" className="text-primary-400 hover:text-primary-300 flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <ContentCarousel 
          title="" 
          contents={moviesContent.slice(0, 10)} 
        />
        
        {/* TV Series Section */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-white">TV Series</h2>
          <Link to="/browse?type=series" className="text-primary-400 hover:text-primary-300 flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <ContentCarousel 
          title="" 
          contents={seriesContent.slice(0, 10)} 
        />
      </div>
    </div>
  );
};

export default HomePage;