import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';

import GenreFilter from '../components/ui/GenreFilter';
import ContentCard from '../components/ui/ContentCard';
import Button from '../components/ui/Button';

import { 
  fetchContentAtom, 
  fetchGenresAtom,
  contentListAtom,
  genresAtom,
  filterByGenreAtom,
  contentLoadingAtom
} from '../store/content';

import { Content } from '../types';

const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const [allContent] = useAtom(contentListAtom);
  const [genres] = useAtom(genresAtom);
  const [isLoading] = useAtom(contentLoadingAtom);
  
  const [, fetchContent] = useAtom(fetchContentAtom);
  const [, fetchGenres] = useAtom(fetchGenresAtom);
  const [, filterByGenre] = useAtom(filterByGenreAtom);
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('rating');
  
  useEffect(() => {
    fetchContent();
    fetchGenres();
  }, [fetchContent, fetchGenres]);
  
  // Filter by type if specified in URL
  const filteredContent = typeParam 
    ? allContent.filter(item => item.type === typeParam)
    : allContent;
  
  // Apply sorting
  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortOption) {
      case 'rating':
        return b.rating - a.rating;
      case 'year':
        return b.releaseYear - a.releaseYear;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  const handleGenreSelect = (genreId: string | null) => {
    setSelectedGenre(genreId);
    filterByGenre(genreId);
  };
  
  const handleTypeFilter = (type: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    setSearchParams(params);
  };
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Browse {typeParam || 'All Content'}</h1>
          <p className="text-gray-400">Discover new movies and shows to watch</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-background-light/40 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-white font-medium">Type:</div>
            <div className="flex bg-background-light rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1.5 text-sm ${!typeParam ? 'bg-primary-600 text-white' : 'text-gray-300'}`}
                onClick={() => handleTypeFilter(null)}
              >
                All
              </button>
              <button 
                className={`px-3 py-1.5 text-sm ${typeParam === 'movie' ? 'bg-primary-600 text-white' : 'text-gray-300'}`}
                onClick={() => handleTypeFilter('movie')}
              >
                Movies
              </button>
              <button 
                className={`px-3 py-1.5 text-sm ${typeParam === 'series' ? 'bg-primary-600 text-white' : 'text-gray-300'}`}
                onClick={() => handleTypeFilter('series')}
              >
                Series
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-background-light text-white border-0 rounded-md py-1.5 pl-2 pr-8 text-sm"
              >
                <option value="rating">Top Rated</option>
                <option value="year">Newest</option>
                <option value="title">A-Z</option>
              </select>
            </div>
            
            <div className="flex bg-background-light rounded-md overflow-hidden">
              <button 
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={16} className="text-gray-300" />
              </button>
              <button 
                className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={16} className="text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Genres Filter */}
        <GenreFilter 
          genres={genres} 
          selectedGenre={selectedGenre} 
          onSelectGenre={handleGenreSelect} 
        />
        
        {/* Content Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {sortedContent.map(content => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedContent.map(content => (
                <ListContentItem key={content.id} content={content} />
              ))}
            </div>
          )
        )}
        
        {/* No Results */}
        {sortedContent.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No content found matching your filters.</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setSelectedGenre(null);
                handleTypeFilter(null);
                filterByGenre(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// List view component
const ListContentItem: React.FC<{ content: Content }> = ({ content }) => {
  return (
    <div className="bg-background-light/50 rounded-lg overflow-hidden hover:bg-background-light transition-colors duration-200">
      <div className="flex">
        <img 
          src={content.poster} 
          alt={content.title} 
          className="w-24 h-36 object-cover"
        />
        <div className="flex flex-col justify-between p-4">
          <div>
            <h3 className="font-semibold text-white">{content.title}</h3>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <span>{content.releaseYear}</span>
              <span className="mx-2">•</span>
              <span>{content.type === 'movie' ? `${content.duration} min` : `${content.duration} seasons`}</span>
              <span className="mx-2">•</span>
              <span className="bg-primary-600/70 text-white px-1.5 py-0.5 rounded text-xs">
                {content.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{content.description}</p>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {content.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs bg-background-dark px-2 py-0.5 rounded-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;