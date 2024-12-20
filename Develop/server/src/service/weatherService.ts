import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    // TODO: Define the baseURL, API key, and city name properties
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';

    if (!this.apiKey) {
      throw new Error('API key is missing. Set it in the environment variables.');
    }
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(query); // Use buildGeocodeQuery
    const response = await fetch(url).then((res) => res.json());

    if (response.length === 0) {
      throw new Error(`Location not found for query: ${query}`);
    }

    const locationData = response[0];
    return { lat: locationData.lat, lon: locationData.lon };
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return { lat: locationData.lat, lon: locationData.lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&appid=${this.apiKey}&limit=1`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url).then((res) => res.json());

    if (!response || !response.main || !response.weather) {
      throw new Error('Invalid weather data received from API');
    }

    return response;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.name,
      new Date().toLocaleDateString(),
      response.weather[0].icon,
      response.weather[0].description,
      (response.main.temp * 9) / 5 + 32, // Convert Celsius to Fahrenheit and assign to tempF
      response.wind.speed,
      response.main.humidity
    );
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, forecastData: any[]): Weather[] {
  //   return forecastData.map((day: any) => {
  //     const date = new Date(day.dt * 1000).toLocaleDateString(); // Convert UNIX timestamp to date
  //     return new Weather(
  //       currentWeather.city,
  //       date,
  //       day.weather[0].icon,
  //       day.weather[0].description,
  //       (day.main.temp * 9) / 5 + 32, // Convert Celsius to Fahrenheit and assign to tempF
  //       day.wind.speed,
  //       day.main.humidity
  //     );
  //   });
  // }

  private buildForecastArray(currentWeather: Weather, forecastData: any[]): Weather[] {
    const uniqueDates = new Set<string>(); // Track dates to ensure uniqueness
    const today = new Date().toLocaleDateString(); // Get today's date
  
    const filteredForecast = forecastData.filter((day: any) => {
      const date = new Date(day.dt * 1000).toLocaleDateString(); // Convert UNIX timestamp to date
      if (uniqueDates.has(date) || date === today) {
        return false; // Skip if the date has already been added or is today
      }
      uniqueDates.add(date);
      return true;
    });
  
    // Limit to 5 days
    return filteredForecast.slice(0, 5).map((day: any) => {
      const date = new Date(day.dt * 1000).toLocaleDateString(); // Convert UNIX timestamp to date
      const temperatureF = ((day.main.temp * 9) / 5 + 32).toFixed(2); // Convert Celsius to Fahrenheit and limit decimals
      return new Weather(
        currentWeather.city,
        date,
        day.weather[0].icon,
        day.weather[0].description,
        parseFloat(temperatureF), // Ensure the temperature is a number
        day.wind.speed,
        day.main.humidity
      );
    });
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchAndDestructureLocationData(city);

    // Fetch current weather data
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);

    // Fetch forecast data (ensure this endpoint exists in your API plan)
    const forecastUrl = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
    const forecastResponse = await fetch(forecastUrl).then((res) => res.json());
    const forecast = this.buildForecastArray(currentWeather, forecastResponse.list);

    return { currentWeather, forecast };
  }
}

export default new WeatherService();
