import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Get the directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Main function to seed the database
async function seedDatabase() {
  console.log('Seeding database...');
  
  // Create genres
  const genres = [
    {
      id: 'action',
      name: 'Action',
      description: 'Films with exciting sequences and high energy'
    },
    {
      id: 'comedy',
      name: 'Comedy',
      description: 'Films intended to make the audience laugh'
    },
    {
      id: 'drama',
      name: 'Drama',
      description: 'Films focused on emotional development of characters'
    },
    {
      id: 'scifi',
      name: 'Sci-Fi',
      description: 'Films featuring futuristic technology and space'
    },
    {
      id: 'horror',
      name: 'Horror',
      description: 'Films intended to frighten or scare the audience'
    },
    {
      id: 'romance',
      name: 'Romance',
      description: 'Films focused on romantic relationships'
    },
    {
      id: 'thriller',
      name: 'Thriller',
      description: 'Films designed to keep the audience on the edge of their seat'
    },
    {
      id: 'documentary',
      name: 'Documentary',
      description: 'Films that document real-world subjects'
    },
    {
      id: 'animation',
      name: 'Animation',
      description: 'Films created using animation techniques'
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      description: 'Films set in fictional universes often including magic'
    }
  ];
  
  // Create content items
  const content = [
    {
      id: uuidv4(),
      title: 'Cosmic Odyssey',
      description: 'A journey through space that challenges our understanding of time and existence.',
      type: 'movie',
      releaseYear: 2023,
      genres: ['scifi', 'drama'],
      poster: 'https://images.pexels.com/photos/2694434/pexels-photo-2694434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 9.2,
      duration: 143,
      cast: ['Emma Rodriguez', 'Michael Chen', 'Sophia Williams'],
      directors: ['Christopher Lee'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/2LqzF5WauAw'
    },
    {
      id: uuidv4(),
      title: 'Night Shadows',
      description: 'A detective hunts a serial killer who only strikes during the new moon.',
      type: 'series',
      releaseYear: 2022,
      genres: ['thriller', 'drama', 'horror'],
      poster: 'https://images.pexels.com/photos/3329718/pexels-photo-3329718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/316902/pexels-photo-316902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.7,
      duration: 3,
      cast: ['James Wilson', 'Aria Kim', 'Marcus Johnson'],
      directors: ['Elena Vasquez'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/NYH2sLid0Zc'
    },
    {
      id: uuidv4(),
      title: 'Last Laugh',
      description: 'A failed comedian finds unexpected success when he starts telling the truth about his life.',
      type: 'movie',
      releaseYear: 2023,
      genres: ['comedy', 'drama'],
      poster: 'https://images.pexels.com/photos/1369476/pexels-photo-1369476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/1316484/pexels-photo-1316484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 7.9,
      duration: 112,
      cast: ['David Miller', 'Olivia Taylor', 'Jacob Wilson'],
      directors: ['Sarah Johnson'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/zAGVQLHvwOY'
    },
    {
      id: uuidv4(),
      title: 'Kingdom of Dragons',
      description: 'In a magical realm, a young villager discovers she is the key to ending an ancient conflict between humans and dragons.',
      type: 'series',
      releaseYear: 2021,
      genres: ['fantasy', 'action', 'adventure'],
      poster: 'https://images.pexels.com/photos/1146642/pexels-photo-1146642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/4348074/pexels-photo-4348074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.4,
      duration: 2,
      cast: ['Liu Ming', 'Amara Okafor', 'Thomas Wright'],
      directors: ['Raj Patel'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/KPLWWIOCOOQ'
    },
    {
      id: uuidv4(),
      title: 'Echoes of Tomorrow',
      description: 'A scientist creates a device that can send messages to the past, with unforeseen consequences.',
      type: 'movie',
      releaseYear: 2023,
      genres: ['scifi', 'thriller'],
      poster: 'https://images.pexels.com/photos/7034529/pexels-photo-7034529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.9,
      duration: 135,
      cast: ['Robert Stone', 'Jessica Lee', 'Ahmad Khalil'],
      directors: ['Maria Chen'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/WULwGkBuVQA'
    },
    {
      id: uuidv4(),
      title: 'Heartstrings',
      description: 'Two musicians from rival bands fall in love despite the odds against them.',
      type: 'movie',
      releaseYear: 2022,
      genres: ['romance', 'drama', 'music'],
      poster: 'https://images.pexels.com/photos/4338008/pexels-photo-4338008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/1994818/pexels-photo-1994818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 7.6,
      duration: 118,
      cast: ['Gabriel Moreno', 'Zoe Parker', 'Daniel Smith'],
      directors: ['Ava Williams'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/yLOqoTHAZW0'
    },
    {
      id: uuidv4(),
      title: 'Urban Jungle',
      description: 'A wildlife documentary exploring how animals adapt to city life around the world.',
      type: 'series',
      releaseYear: 2023,
      genres: ['documentary', 'nature'],
      poster: 'https://images.pexels.com/photos/1563485/pexels-photo-1563485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/1770813/pexels-photo-1770813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 9.1,
      duration: 1,
      cast: [],
      directors: ['David Attenborough', 'Jane Goodall'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/IlFRPkT-hVc'
    },
    {
      id: uuidv4(),
      title: 'The Heist',
      description: 'A team of specialists plan the most daring art heist in history.',
      type: 'movie',
      releaseYear: 2021,
      genres: ['action', 'thriller', 'crime'],
      poster: 'https://images.pexels.com/photos/3201783/pexels-photo-3201783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.2,
      duration: 127,
      cast: ['Leo Martin', 'Naomi Watts', 'Idris Kanu'],
      directors: ['Sofia Rodriguez'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/6uGQ_ypTw08'
    },
    {
      id: uuidv4(),
      title: 'Pixel Dreams',
      description: 'An animator's creations come to life and begin to invade the real world.',
      type: 'movie',
      releaseYear: 2023,
      genres: ['animation', 'fantasy', 'family'],
      poster: 'https://images.pexels.com/photos/972804/pexels-photo-972804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/4348490/pexels-photo-4348490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.5,
      duration: 105,
      cast: ['Voice actors'],
      directors: ['Hiroshi Tanaka'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/UNmAjzhMKEA'
    },
    {
      id: uuidv4(),
      title: 'Desert Mirage',
      description: 'A group of strangers are stranded in the desert and must work together to survive.',
      type: 'series',
      releaseYear: 2022,
      genres: ['drama', 'adventure', 'mystery'],
      poster: 'https://images.pexels.com/photos/998653/pexels-photo-998653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/355747/pexels-photo-355747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.0,
      duration: 2,
      cast: ['Aisha Oman', 'Blake Wilson', 'Carla Diaz'],
      directors: ['Mohammed Al Fayed'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/lL0NHoHpO0c'
    },
    {
      id: uuidv4(),
      title: 'Haunted Halls',
      description: 'Students at a prestigious boarding school uncover dark secrets about the institution's past.',
      type: 'series',
      releaseYear: 2023,
      genres: ['horror', 'mystery'],
      poster: 'https://images.pexels.com/photos/2373086/pexels-photo-2373086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/3354471/pexels-photo-3354471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 7.8,
      duration: 2,
      cast: ['Teenagers', 'School teachers'],
      directors: ['Mike Flanagan'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/tykS7QfTWMQ'
    },
    {
      id: uuidv4(),
      title: 'Capital Games',
      description: 'Political intrigue unfolds as ambitious staffers navigate the corridors of power.',
      type: 'series',
      releaseYear: 2022,
      genres: ['drama', 'politics'],
      poster: 'https://images.pexels.com/photos/64271/white-house-american-flag-washington-dc-landmark-64271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/208704/pexels-photo-208704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.8,
      duration: 4,
      cast: ['Victoria Reed', 'Harrison James', 'Olivia Kwon'],
      directors: ['David Finch'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/ULwUzF1q5w4'
    },
    {
      id: uuidv4(),
      title: 'Culinary Journey',
      description: 'A chef travels the world learning about different cuisines and cultures.',
      type: 'series',
      releaseYear: 2023,
      genres: ['documentary', 'food', 'travel'],
      poster: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/5638331/pexels-photo-5638331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.6,
      duration: 2,
      cast: ['Chef Antonio'],
      directors: ['Luis Martinez'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/0-NGDSEx78E'
    },
    {
      id: uuidv4(),
      title: 'Checkmate',
      description: 'A chess prodigy from a poor neighborhood challenges the established elite of the chess world.',
      type: 'movie',
      releaseYear: 2021,
      genres: ['drama', 'sports'],
      poster: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/411766/pexels-photo-411766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.3,
      duration: 130,
      cast: ['Young prodigy', 'Chess master'],
      directors: ['Anya Taylor-Joy'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/cdSEfHrGGrI'
    },
    {
      id: uuidv4(),
      title: 'Revolutions',
      description: 'A group of young activists start a movement that changes the political landscape of their country.',
      type: 'series',
      releaseYear: 2022,
      genres: ['drama', 'politics', 'history'],
      poster: 'https://images.pexels.com/photos/6170183/pexels-photo-6170183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/6168358/pexels-photo-6168358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 8.1,
      duration: 3,
      cast: ['Revolutionary leaders'],
      directors: ['Political filmmaker'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/ViMF510wqWA'
    },
    {
      id: uuidv4(),
      title: 'Behind the Screen',
      description: 'An inside look at how social media is designed to be addictive and its effects on society.',
      type: 'movie',
      releaseYear: 2023,
      genres: ['documentary', 'technology'],
      poster: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      backdrop: 'https://images.pexels.com/photos/935979/pexels-photo-935979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 9.0,
      duration: 98,
      cast: ['Tech executives', 'Psychologists'],
      directors: ['Tech documentary director'],
      similarContent: [],
      trailerUrl: 'https://www.youtube.com/embed/7mqR_e2seeM'
    }
  ];
  
  // Update similar content references
  content.forEach((item, index) => {
    // Generate 2-4 similar content items
    const numSimilar = Math.floor(Math.random() * 3) + 2;
    const similarIndices = new Set();
    
    while (similarIndices.size < numSimilar) {
      const randomIndex = Math.floor(Math.random() * content.length);
      if (randomIndex !== index) {
        similarIndices.add(randomIndex);
      }
    }
    
    item.similarContent = Array.from(similarIndices).map(i => content[i].id);
  });
  
  // Create a demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      id: uuidv4(),
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      avatar: 'https://i.pravatar.cc/150?u=demo@example.com',
      preferences: {
        genres: ['scifi', 'action', 'drama'],
        likedActors: ['Emma Rodriguez', 'James Wilson'],
        likedDirectors: ['Christopher Lee', 'Sofia Rodriguez'],
        watchedContent: []
      }
    }
  ];
  
  // Create some viewing history for the demo user
  const history = [
    {
      id: uuidv4(),
      userId: users[0].id,
      contentId: content[0].id,
      watchedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      watchedPercentage: 100,
      completed: true
    },
    {
      id: uuidv4(),
      userId: users[0].id,
      contentId: content[2].id,
      watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      watchedPercentage: 100,
      completed: true
    },
    {
      id: uuidv4(),
      userId: users[0].id,
      contentId: content[4].id,
      watchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      watchedPercentage: 45,
      completed: false
    }
  ];
  
  // Update user's watched content
  users[0].preferences.watchedContent = history
    .filter(h => h.completed)
    .map(h => h.contentId);
  
  // Create recommendations for the demo user
  const recommendations = [
    {
      id: uuidv4(),
      userId: users[0].id,
      contentId: content[1].id,
      score: 95,
      reason: 'Based on your interest in sci-fi',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: users[0].id,
      contentId: content[7].id,
      score: 92,
      reason: 'Because you watched Cosmic Odyssey',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: users[0].id,
      contentId: content[11].id,
      score: 88,
      reason: 'Highly rated documentary',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Create the database
  const db = {
    users,
    content,
    genres,
    history,
    recommendations
  };
  
  // Write to db.json
  fs.writeFileSync(join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
  
  console.log('Database seeded successfully!');
}

// Run the seed function
seedDatabase().catch(console.error);