import dotenv from 'dotenv';
dotenv.config();
import fs from 'node:fs/promises';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private dbPath: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.dbPath = 'db/weather.json';

    if (!this.apiKey) {
      throw new Error('API key for OpenWeatherMap is missing. Please set it in the environment variables.');
    }
  }

  // TODO: Create read method to fetch data from the database
  private async read(): Promise<string> {
    return await fs.readFile(this.dbPath, {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // TODO: Create write method to save data to the database
  private async write(data: any): Promise<void> {
    return await fs.writeFile(this.dbPath, JSON.stringify(data, null, '\t'));
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&appid=${this.apiKey}&limit=1`;
    const response = await fetch(url).then(res => res.json());

    if (response.length === 0) {
      throw new Error(`Location not found for query: ${query}`);
    }

    const locationData = response[0];
    return { lat: locationData.lat, lon: locationData.lon };
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    return await fetch(url).then(res => res.json());
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.weather[0].description,
      response.main.humidity,
      response.wind.speed
    );
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }

  // TODO: Create getSavedWeather method
  async getSavedWeather(): Promise<any[]> {
    return await this.read().then((data) => {
      try {
        return JSON.parse(data);
      } catch (err) {
        return [];
      }
    });
  }

  // TODO: Create saveWeather method
  async saveWeather(city: string): Promise<void> {
    const weather = await this.getWeatherForCity(city);
    const savedWeather = await this.getSavedWeather();

    const updatedWeather = [...savedWeather, { city, weather }];
    await this.write(updatedWeather);
  }

  // TODO: Create removeWeather method  
  async removeWeather(city: string): Promise<void> {
    const savedWeather = await this.getSavedWeather();
    const updatedWeather = savedWeather.filter((entry: any) => entry.city !== city);
    await this.write(updatedWeather);
  }
}

export default new WeatherService();


