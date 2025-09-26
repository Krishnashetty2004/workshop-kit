const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');

// Import routes
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');
const emailRoutes = require('./routes/email');
const aiRoutes = require('./routes/ai-generation');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Workshop Starter Kit Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/email', emailRoutes.router);
app.use('/api/ai', aiRoutes);

// Workshop management endpoints
app.get('/api/workshops', async (req, res) => {
  try {
    const { getAllWorkshops } = require('./db');
    const workshops = await getAllWorkshops();
    
    res.json({
      success: true,
      workshops
    });
  } catch (error) {
    console.error('Get workshops error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workshops'
    });
  }
});

app.get('/api/workshops/:id', async (req, res) => {
  try {
    const { getWorkshop } = require('./db');
    const { id } = req.params;
    
    const workshop = await getWorkshop(id);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        error: 'Workshop not found'
      });
    }
    
    res.json({
      success: true,
      workshop
    });
  } catch (error) {
    console.error('Get workshop error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get workshop'
    });
  }
});

app.post('/api/workshops/:id/publish', async (req, res) => {
  try {
    const { updateWorkshopStatus } = require('./db');
    const { id } = req.params;
    
    await updateWorkshopStatus(id, 'published');
    
    res.json({
      success: true,
      message: 'Workshop published successfully'
    });
  } catch (error) {
    console.error('Publish workshop error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish workshop'
    });
  }
});

app.get('/api/workshops/:id/attendees', async (req, res) => {
  try {
    const { getAttendeesByWorkshop } = require('./db');
    const { id } = req.params;
    
    const attendees = await getAttendeesByWorkshop(id);
    
    res.json({
      success: true,
      attendees
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get attendees'
    });
  }
});

// Analytics endpoints
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const { getAllWorkshops, getWorkshopStats } = require('./db');
    
    const workshops = await getAllWorkshops();
    const publishedWorkshops = workshops.filter(w => w.status === 'published');
    
    let totalRevenue = 0;
    let totalAttendees = 0;
    
    for (const workshop of publishedWorkshops) {
      const stats = await getWorkshopStats(workshop.id);
      totalRevenue += stats.total_revenue || 0;
      totalAttendees += stats.total_attendees || 0;
    }
    
    res.json({
      success: true,
      analytics: {
        totalWorkshops: workshops.length,
        publishedWorkshops: publishedWorkshops.length,
        totalRevenue,
        totalAttendees,
        conversionRate: totalAttendees > 0 ? (totalAttendees / (totalAttendees + 100)) * 100 : 0
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Workshop Starter Kit Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;