import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { User, Heart, Clock, Film, Tv, Edit, Trash } from 'lucide-react';
import { authStateAtom } from '../store/auth';
import { historyWithContentAtom, fetchHistoryAtom } from '../store/history';
import { genresAtom, fetchGenresAtom } from '../store/content';
import ContentCard from '../components/ui/ContentCard';
import Button from '../components/ui/Button';

const ProfilePage: React.FC = () => {
  const [{ user }] = useAtom(authStateAtom);
  const [viewingHistory] = useAtom(historyWithContentAtom);
  const [genres] = useAtom(genresAtom);
  const [, fetchHistory] = useAtom(fetchHistoryAtom);
  const [, fetchGenres] = useAtom(fetchGenresAtom);
  
  const [activeTab, setActiveTab] = useState<'history' | 'preferences' | 'account'>('history');
  
  useEffect(() => {
    fetchHistory();
    fetchGenres();
  }, [fetchHistory, fetchGenres]);
  
  const completedContent = viewingHistory.filter(item => item.completed);
  const inProgressContent = viewingHistory.filter(item => !item.completed && item.watchedPercentage > 0);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Get genre objects for user's preferred genres
  const preferredGenres = genres.filter(genre => 
    user.preferences.genres.includes(genre.id)
  );
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          {/* Profile Image */}
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-32 w-32 rounded-full object-cover border-4 border-primary-500"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-primary-700 flex items-center justify-center text-white text-4xl border-4 border-primary-500">
              {user.name.charAt(0)}
            </div>
          )}
          
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300">
              <div className="flex items-center">
                <Clock className="mr-2 text-primary-400" size={20} />
                <span>
                  <strong className="text-white">{viewingHistory.length}</strong> Watched
                </span>
              </div>
              <div className="flex items-center">
                <Film className="mr-2 text-primary-400" size={20} />
                <span>
                  <strong className="text-white">{viewingHistory.filter(h => h.content.type === 'movie').length}</strong> Movies
                </span>
              </div>
              <div className="flex items-center">
                <Tv className="mr-2 text-primary-400" size={20} />
                <span>
                  <strong className="text-white">{viewingHistory.filter(h => h.content.type === 'series').length}</strong> Series
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <Button variant="ghost" size="sm" className="flex items-center">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'history'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Viewing History
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'preferences'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'account'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="animate-fade-in">
          {/* Viewing History Tab */}
          {activeTab === 'history' && (
            <div>
              {viewingHistory.length === 0 ? (
                <div className="text-center py-12 bg-background-light/30 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No viewing history yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Start watching movies and shows to build your viewing history and get personalized recommendations.
                  </p>
                </div>
              ) : (
                <>
                  {/* In Progress Content */}
                  {inProgressContent.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-white mb-4">Continue Watching</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {inProgressContent.map(item => (
                          <ContentCard 
                            key={item.id} 
                            content={item.content!} 
                            isContinueWatching 
                            progress={item.watchedPercentage} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Completed Content */}
                  {completedContent.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-white mb-4">Completed</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {completedContent.map(item => (
                          <ContentCard key={item.id} content={item.content!} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              {/* Preferred Genres */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Preferred Genres</h2>
                  <Button variant="ghost" size="sm">
                    Edit Preferences
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {preferredGenres.length > 0 ? (
                    preferredGenres.map(genre => (
                      <div key={genre.id} className="bg-background-light rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{genre.name}</h3>
                          <p className="text-gray-400 text-sm">{genre.description}</p>
                        </div>
                        <Heart className="text-primary-500 fill-current" size={20} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 bg-background-light/30 rounded-lg">
                      <Heart className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">No preferences set</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Add your favorite genres to get better recommendations tailored to your taste.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Other Preferences (Liked Actors, Directors) */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Favorite Actors & Directors</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {user.preferences.likedActors.length > 0 || user.preferences.likedDirectors.length > 0 ? (
                    <>
                      {user.preferences.likedActors.map((actor, index) => (
                        <div key={index} className="bg-background-light rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium">{actor}</h3>
                            <p className="text-gray-400 text-sm">Actor</p>
                          </div>
                          <Heart className="text-primary-500 fill-current" size={20} />
                        </div>
                      ))}
                      
                      {user.preferences.likedDirectors.map((director, index) => (
                        <div key={index} className="bg-background-light rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium">{director}</h3>
                            <p className="text-gray-400 text-sm">Director</p>
                          </div>
                          <Heart className="text-primary-500 fill-current" size={20} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="col-span-full text-center py-8 bg-background-light/30 rounded-lg">
                      <User className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">No favorites added</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Add your favorite actors and directors to get recommendations featuring them.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <div>
              <div className="bg-background-light rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <div className="flex items-center justify-between">
                      <div className="text-white">{user.name}</div>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <div className="flex items-center justify-between">
                      <div className="text-white">{user.email}</div>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <div className="flex items-center justify-between">
                      <div className="text-white">••••••••</div>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Edit size={14} className="mr-1" /> Change
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-light rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Danger Zone</h2>
                
                <div className="border border-error-500/30 rounded-lg p-4 bg-error-500/10">
                  <h3 className="font-medium text-white mb-2">Delete Account</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. All of your data will be permanently removed.
                  </p>
                  <Button variant="danger" size="sm" className="flex items-center">
                    <Trash size={14} className="mr-2" /> Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;