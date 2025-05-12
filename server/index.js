import express from 'express';
import cors from 'cors';
import jsonServer from 'json-server';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Get the directory path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure lowdb to use JSON file
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// JWT secret
const JWT_SECRET = 'streamai-secret-key';

// Initialize express
const app = express();

// Initialize json-server
const router = jsonServer.router(file);
const middlewares = jsonServer.defaults();

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Load database
await db.read();

// Initialize database if it doesn't exist
if (!db.data) {
  db.data = {
    users: [],
    content: [],
    genres: [],
    history: [],
    recommendations: []
  };
  await db.write();
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if user exists
  const existingUser = db.data.users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
    preferences: {
      genres: [],
      likedActors: [],
      likedDirectors: [],
      watchedContent: []
    }
  };
  
  // Add user to database
  db.data.users.push(newUser);
  await db.write();
  
  // Create token
  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token
  });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Find user
  const user = db.data.users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Create token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token
  });
});

app.get('/auth/me', authenticateToken, (req, res) => {
  const user = db.data.users.find(user => user.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

// AI recommendation endpoint (simulated)
app.post('/recommendations/refresh/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  
  // Check if user exists
  const user = db.data.users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Get user history
  const userHistory = db.data.history.filter(h => h.userId === userId);
  
  // Get completed content IDs
  const watchedContentIds = userHistory
    .filter(h => h.completed)
    .map(h => h.contentId);
  
  // Update user's watched content
  user.preferences.watchedContent = watchedContentIds;
  
  // Get all content
  const allContent = db.data.content;
  
  // Generate recommendations based on user history and preferences
  // This is a simplified algorithm for the MVP
  const unwatchedContent = allContent.filter(c => !watchedContentIds.includes(c.id));
  
  // Clear previous recommendations
  db.data.recommendations = db.data.recommendations.filter(r => r.userId !== userId);
  
  // Generate new recommendations with different approaches for variety
  const newRecommendations = [];
  
  // 1. Genre-based recommendations
  if (user.preferences.genres.length > 0) {
    const genreBasedRecs = unwatchedContent
      .filter(c => c.genres.some(g => user.preferences.genres.includes(g)))
      .slice(0, 3)
      .map(content => ({
        id: uuidv4(),
        userId,
        contentId: content.id,
        score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
        reason: `Based on your interest in ${content.genres[0]}`,
        createdAt: new Date().toISOString()
      }));
    
    newRecommendations.push(...genreBasedRecs);
  }
  
  // 2. Similar content recommendations
  if (watchedContentIds.length > 0) {
    const watchedContent = allContent.filter(c => watchedContentIds.includes(c.id));
    const similarContentIds = new Set();
    
    watchedContent.forEach(content => {
      content.similarContent.forEach(id => {
        if (!watchedContentIds.includes(id)) {
          similarContentIds.add(id);
        }
      });
    });
    
    const similarRecs = [...similarContentIds]
      .slice(0, 3)
      .map(contentId => {
        const content = allContent.find(c => c.id === contentId);
        return {
          id: uuidv4(),
          userId,
          contentId,
          score: Math.floor(Math.random() * 15) + 85, // Random score between 85-100
          reason: `Because you watched ${watchedContent[0].title}`,
          createdAt: new Date().toISOString()
        };
      });
    
    newRecommendations.push(...similarRecs);
  }
  
  // 3. High-rated content recommendations
  const highRatedRecs = unwatchedContent
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map(content => ({
      id: uuidv4(),
      userId,
      contentId: content.id,
      score: Math.floor(Math.random() * 10) + 90, // Random score between 90-100
      reason: `Highly rated ${content.type}`,
      createdAt: new Date().toISOString()
    }));
  
  newRecommendations.push(...highRatedRecs);
  
  // 4. Add some personalized recommendations
  if (user.preferences.likedActors.length > 0 || user.preferences.likedDirectors.length > 0) {
    const actorDirectorRecs = unwatchedContent
      .filter(c => 
        c.cast.some(actor => user.preferences.likedActors.includes(actor)) ||
        c.directors.some(director => user.preferences.likedDirectors.includes(director))
      )
      .slice(0, 2)
      .map(content => {
        let reason = '';
        
        if (c.cast.some(actor => user.preferences.likedActors.includes(actor))) {
          const actor = c.cast.find(a => user.preferences.likedActors.includes(a));
          reason = `Featuring ${actor}`;
        } else {
          const director = c.directors.find(d => user.preferences.likedDirectors.includes(d));
          reason = `Directed by ${director}`;
        }
        
        return {
          id: uuidv4(),
          userId,
          contentId: content.id,
          score: Math.floor(Math.random() * 5) + 95, // Random score between 95-100
          reason,
          createdAt: new Date().toISOString()
        };
      });
    
    newRecommendations.push(...actorDirectorRecs);
  }
  
  // Add new recommendations to the database
  db.data.recommendations.push(...newRecommendations);
  
  // Save the database
  await db.write();
  
  res.json(newRecommendations);
});

// Use json-server router
app.use(middlewares);

// Add json-server custom routes
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/recommendations/similar/:contentId') {
    const contentId = req.params.contentId;
    const content = db.data.content.find(c => c.id === contentId);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    const similarContent = content.similarContent
      .map(id => db.data.content.find(c => c.id === id))
      .filter(Boolean);
    
    return res.json(similarContent);
  }
  
  next();
});

app.use(router);

// Port
const PORT = 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});