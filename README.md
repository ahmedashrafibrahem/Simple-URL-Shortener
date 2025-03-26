# Simple URL Shortener

A modern URL shortener service built with Node.js, Express, and MongoDB.

## Features

- Shorten long URLs to compact, shareable links
- Automatic redirection to original URLs
- Modern, responsive user interface
- Copy to clipboard functionality
- MongoDB for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas connection string)
- npm or yarn

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Option 1: Deploy to Heroku

1. Create a Heroku account at https://heroku.com
2. Install the Heroku CLI
3. Login to Heroku:
```bash
heroku login
```
4. Create a new Heroku app:
```bash
heroku create your-app-name
```
5. Add MongoDB addon:
```bash
heroku addons:create mongolab
```
6. Deploy to Heroku:
```bash
git push heroku main
```

### Option 2: Deploy to Railway

1. Create a Railway account at https://railway.app
2. Connect your GitHub repository
3. Add MongoDB service
4. Deploy the application

### Option 3: Deploy to Render

1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Create a new Web Service
4. Add MongoDB service
5. Deploy the application

## Environment Variables

For deployment, set these environment variables:
- `PORT`: The port your application will run on (default: 3000)
- `MONGODB_URI`: Your MongoDB connection string

## API Endpoints

- `POST /api/shorten` - Create a new short URL
  - Request body: `{ "url": "https://example.com" }`
  - Response: `{ "shortUrl": "abc123" }`

- `GET /:shortUrl` - Redirect to the original URL

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Nanoid for generating unique IDs
- Modern CSS with Flexbox
- Vanilla JavaScript

## License

MIT 