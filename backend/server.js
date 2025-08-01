

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const WebSocket = require('ws');
const http = require('http');

// Load environment variables
dotenv.config({ path: '../.env.local' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Revolt Motors system prompt
const REVOLT_MOTORS_SYSTEM_PROMPT = `You are the Revolt Motors AI assistant, specializing exclusively in Revolt Motors electric motorcycles. You help users learn about our revolutionary electric bikes: RV400 (flagship), RV300 (urban commuter), RV1/RV1+ (entry-level). Discuss topics like: electric motorcycles, AI features, MyRevolt app, battery technology, pricing, sustainability, Rahul Sharma (founder/CEO), Anjali Rattan (CBO). For non-Revolt Motors questions, redirect to our electric mobility solutions. Be enthusiastic about the electric revolution and zero-emission future!`;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Revolt Motors AI Backend Server is running!',
    company: 'Revolt Motors - Switch to Electric, Switch to Smart',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint for text-based AI interactions
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: REVOLT_MOTORS_SYSTEM_PROMPT
    });

    // Build chat history
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString(),
      model: 'gemini-1.5-flash'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Audio processing endpoint (for future audio features)
app.post('/api/audio', async (req, res) => {
  try {
    const { audioData, format = 'wav' } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // For now, return a placeholder response
    // This can be expanded to handle audio processing with Gemini
    res.json({
      success: true,
      message: 'Audio processing endpoint ready',
      note: 'Audio processing with Gemini will be implemented here',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Audio API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process audio request',
      details: error.message 
    });
  }
});

// WebSocket connection for real-time audio streaming
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'audio_stream') {
        // Handle real-time audio streaming
        ws.send(JSON.stringify({
          type: 'audio_response',
          message: 'Real-time audio processing ready',
          timestamp: new Date().toISOString()
        }));
      } else if (data.type === 'chat') {
        // Handle real-time chat
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          systemInstruction: REVOLT_MOTORS_SYSTEM_PROMPT
        });

        const result = await model.generateContent(data.message);
        const response = await result.response;
        
        ws.send(JSON.stringify({
          type: 'chat_response',
          message: response.text(),
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('WebSocket Error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process request',
        error: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Company info endpoint
app.get('/api/company', (req, res) => {
  res.json({
    name: 'Revolt Motors',
    founder: 'Rahul Sharma',
    ceo: 'Rahul Sharma',
    cbo: 'Anjali Rattan',
    established: '2019',
    headquarters: 'Gurugram, India',
    manufacturing: 'Manesar, Haryana',
    products: ['RV400', 'RV300', 'RV1', 'RV1+'],
    features: ['AI-enabled', 'MyRevolt App', 'Sound Simulator', 'GPS Tracking'],
    services: ['Electric Motorcycles', 'Battery Technology', 'Smart Connectivity'],
    location: 'Pan-India (40+ cities)',
    mission: 'Making electric mobility accessible, affordable, and exciting',
    tagline: 'Switch to Electric, Switch to Smart',
    sustainability: 'Zero emissions, Green mobility revolution'
  });
});

// Motorcycle models endpoint
app.get('/api/models', (req, res) => {
  res.json({
    models: [
      {
        name: 'RV400',
        type: 'Flagship',
        range: '150 km',
        topSpeed: '85 km/h',
        power: '3000W BLDC Motor',
        battery: '3.24 kWh Lithium-ion',
        price: '₹1,29,463',
        features: ['AI-enabled', 'Sound Simulator', 'Mobile App', 'GPS Tracking']
      },
      {
        name: 'RV300',
        type: 'Urban Commuter',
        range: '180 km',
        topSpeed: '65 km/h',
        power: '1500W BLDC Motor',
        battery: '2.7 kWh Lithium-ion',
        price: '₹99,990',
        features: ['Mobile App', 'GPS Tracking', 'City Optimized']
      },
      {
        name: 'RV1+',
        type: 'Entry Level',
        range: '100+ km',
        topSpeed: '50 km/h',
        power: 'Entry Level Motor',
        battery: 'Removable Battery',
        price: '₹84,990',
        features: ['Removable Battery', 'Mobile Connectivity', 'Affordable']
      }
    ],
    totalModels: 3,
    company: 'Revolt Motors'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/chat',
      'POST /api/audio',
      'GET /api/company',
      'GET /api/models'
    ],
    company: 'Revolt Motors - Revolutionary Electric Mobility'
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('🏍️ Revolt Motors AI Backend Server Started!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket server ready on ws://localhost:${PORT}`);
  console.log(`� Revolutionary Electric Mobility Experience`);
  console.log(`🏢 Serving: Revolt Motors AI Assistant`);
  console.log(`🌱 Mission: Switch to Electric, Switch to Smart`);
  console.log('📋 Available endpoints:');
  console.log('   - GET  /health');
  console.log('   - POST /api/chat');
  console.log('   - POST /api/audio');
  console.log('   - GET  /api/company');
  console.log('   - GET  /api/models');
});
