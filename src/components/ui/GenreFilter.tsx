import React from 'react';
import { Genre } from '../../types';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string | null;
  onSelectGenre: (genreId: string | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  genres, 
  selectedGenre, 
  onSelectGenre 
}) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto py-2 mb-4 -mx-4 px-4 hide-scrollbar">
      <button
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
          ${!selectedGenre 
            ? 'bg-primary-600 text-white' 
            : 'bg-background-light text-gray-300 hover:bg-gray-800'
          }`}
        onClick={() => onSelectGenre(null)}
      >
        All
      </button>
      
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
            ${selectedGenre === genre.id 
              ? 'bg-primary-600 text-white' 
              : 'bg-background-light text-gray-300 hover:bg-gray-800'
            }`}
          onClick={() => onSelectGenre(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;