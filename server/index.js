const express = require('express');
const cors = require('cors');
const path = require('path');
const { API_CONFIG, MOCK_WORKSHOPS, MOCK_ANALYTICS } = require('../lib/constants');

const app = express();
const PORT = API_CONFIG.server.port;

// Middleware
app.use(cors({
  origin: API_CONFIG.server.cors.origin,
  credentials: true
}));
app.use(express.json());

// Serve static files from the Next.js build
app.use(express.static(path.join(__dirname, '../out')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Express server is running' });
});

// Workshop management endpoints
app.get('/api/workshops', (req, res) => {
  res.json(MOCK_WORKSHOPS);
});

app.get('/api/workshops/:id', (req, res) => {
  const { id } = req.params;
  // Mock workshop details
  const workshop = {
    id,
    title: 'Sample Workshop',
    description: 'This is a sample workshop description',
    instructor: {
      name: 'John Doe',
      bio: 'Experienced instructor with 10+ years of experience'
    },
    date: '2025-01-15',
    time: '2:00 PM EST',
    duration: '2 hours',
    price: 75,
    currency: 'USD',
    maxAttendees: 20,
    category: 'Development',
    skills: ['React', 'JavaScript', 'Frontend Development'],
    agenda: [
      { time: '2:00', title: 'Introduction', description: 'Welcome and overview' },
      { time: '2:30', title: 'Core Concepts', description: 'Main topics covered' },
      { time: '3:00', title: 'Hands-on Practice', description: 'Interactive exercises' },
      { time: '3:30', title: 'Q&A', description: 'Questions and answers' }
    ],
    testimonials: [
      {
        name: 'Jane Smith',
        role: 'Developer',
        content: 'Great workshop with practical insights!'
      }
    ],
    faq: [
      {
        question: 'What do I need to prepare?',
        answer: 'Just bring yourself and a willingness to learn!'
      }
    ],
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      fontFamily: 'Inter',
      style: 'modern'
    },
    status: 'published',
    createdAt: new Date().toISOString(),
    attendees: []
  };
  
  res.json(workshop);
});

app.post('/api/workshops/:id/publish', (req, res) => {
  const { id } = req.params;
  // Mock publishing logic
  res.json({ 
    success: true, 
    message: 'Workshop published successfully',
    workshopId: id 
  });
});

app.get('/api/workshops/:id/attendees', (req, res) => {
  const { id } = req.params;
  // Mock attendees data
  const attendees = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      registeredAt: '2025-01-10T10:00:00Z',
      paymentStatus: 'completed',
      paymentId: 'pay_123456'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      registeredAt: '2025-01-11T14:30:00Z',
      paymentStatus: 'completed',
      paymentId: 'pay_789012'
    }
  ];
  
  res.json(attendees);
});

app.post('/api/workshops/:id/register', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  // Mock registration logic
  const attendee = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    registeredAt: new Date().toISOString(),
    paymentStatus: 'pending',
    paymentId: null
  };
  
  res.json({ 
    success: true, 
    message: 'Registration successful',
    attendee 
  });
});

// Analytics endpoints
app.get('/api/analytics/overview', (req, res) => {
  res.json(MOCK_ANALYTICS);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../out/index.html'));
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
