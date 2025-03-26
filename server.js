const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

// Routes
app.post('/api/shorten', async (req, res) => {
    console.log('Received shorten request:', req.body);
    try {
        const { url } = req.body;
        
        // Validate URL
        if (!url) {
            console.log('Error: No URL provided');
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            console.log('Error: Invalid URL format');
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Check if URL already exists
        const existingUrl = await Url.findOne({ originalUrl: url });
        if (existingUrl) {
            console.log('Found existing URL:', existingUrl);
            return res.json({ shortUrl: existingUrl.shortUrl });
        }

        // Create new short URL
        const shortUrl = nanoid(8);
        console.log('Creating new short URL:', shortUrl);
        const newUrl = new Url({
            originalUrl: url,
            shortUrl: shortUrl
        });

        await newUrl.save();
        console.log('Successfully saved new URL');
        res.json({ shortUrl });
    } catch (error) {
        console.error('Error in /api/shorten:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
});

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle short URL redirects
app.get('/:shortUrl', async (req, res) => {
    console.log('Received redirect request for:', req.params.shortUrl);
    try {
        const { shortUrl } = req.params;
        
        // Skip if the request is for static files
        if (shortUrl.includes('.')) {
            return next();
        }

        const url = await Url.findOne({ shortUrl });

        if (!url) {
            console.log('URL not found:', shortUrl);
            return res.status(404).json({ error: 'URL not found' });
        }

        console.log('Redirecting to:', url.originalUrl);
        res.redirect(url.originalUrl);
    } catch (error) {
        console.error('Error in redirect:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
}); 