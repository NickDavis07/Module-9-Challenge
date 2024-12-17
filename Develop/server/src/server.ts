import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder - Done
app.use(express.static('../client/dist'));

// TODO: Implement middleware for parsing JSON and urlencoded form data - Done
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: Implement middleware to connect the routes - Done
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
