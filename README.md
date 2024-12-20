# Weather Dashboard

A simple weather dashboard application that allows users to search for weather conditions in cities, view current weather data, and see a 5-day forecast. The application also maintains a search history for quick access to previous searches.

## Deployed Site
- [Weather Dashboard](https://weather-dashboard-kjdi.onrender.com)

## Features

- Search for current weather and 5-day forecast by city.
- Display detailed weather information including temperature, wind speed, and humidity.
- Save search history and display it in a list for easy access.
- Responsive and user-friendly interface.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** JSON-based file storage for search history
- **APIs:** OpenWeatherMap API

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your local machine.
- An OpenWeatherMap API key.

### Installation

1. Clone the repository:
   git clone https://github.com/your-username/weather-dashboard.git

2. Navigate to the project directory:
   cd weather-dashboard
   
4. Install dependencies:
  npm install

5. Create a `.env` file in the `dev` folder with the following content:
   API_BASE_URL=https://api.openweathermap.org
   API_KEY=your_openweathermap_api_key


6. Start the application:
   npm start


7. Open your browser and go to:
   http://localhost:3000


## API Endpoints

### Weather
- **POST** `/api/weather/` - Fetch weather data for a given city.
- **GET** `/api/weather/history` - Retrieve the search history.
- **DELETE** `/api/weather/history/:id` - Delete a city from the search history.
