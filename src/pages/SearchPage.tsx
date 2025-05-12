import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Search as SearchIcon } from 'lucide-react';

import { searchContentAtom, contentListAtom, contentLoadingAtom } from '../store/content';
import ContentCard from '../components/ui/ContentCard';
import Input from '../components/ui/Input';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchResults] = useAtom(contentListAtom);
  const [isLoading] = useAtom(contentLoadingAtom);
  const [, searchContent] = useAtom(searchContentAtom);
  
  useEffect(() => {
    // Set the search input to the query param value
    if (queryParam) {
      setSearchQuery(queryParam);
      searchContent(queryParam);
    }
  }, [queryParam, searchContent]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchContent(searchQuery);
    }
  };
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search for movies, TV shows, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              className="pl-10 py-3 text-lg"
            />
            <SearchIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
          </div>
        </form>
        
        {/* Search Results */}
        <div className="mb-8">
          {queryParam && (
            <h2 className="text-xl font-semibold text-white mb-4">
              {isLoading 
                ? 'Searching...' 
                : `Results for "${queryParam}" (${searchResults.length})`
              }
            </h2>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {searchResults.map(content => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : queryParam ? (
            <div className="text-center py-12 bg-background-light/30 rounded-lg">
              <SearchIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn't find any content matching "{queryParam}". Try different keywords or browse our content.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 bg-background-light/30 rounded-lg">
              <SearchIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Start searching</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Enter keywords to search for movies, TV shows, genres, or actors.
              </p>
            </div>
          )}
        </div>
        
        {/* Search Suggestions (for empty state) */}
        {!queryParam && !isLoading && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Animation'].map(term => (
                <button
                  key={term}
                  className="bg-background-light px-4 py-2 rounded-full text-gray-300 hover:bg-primary-800 hover:text-white transition-colors"
                  onClick={() => {
                    setSearchQuery(term);
                    searchContent(term);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;