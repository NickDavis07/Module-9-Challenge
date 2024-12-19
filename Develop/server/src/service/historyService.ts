// TODO: Define a City class with name and id properties

// TODO: Complete the HistoryService class
// class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  
// }

// export default new HistoryService();







import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private dbPath = 'db/searchHistory.json';

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<string> {
    return await fs.readFile(this.dbPath, {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    return await fs.writeFile(this.dbPath, JSON.stringify(cities, null, '\t'));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read().then((data) => {
      try {
        return JSON.parse(data) as City[];
      } catch (err) {
        return [];
      }
    });
  }

  // TODO: Define an addCityToHistory method that adds a city to the searchHistory.json file
  async addCityToHistory(city: string): Promise<void> {
    if (!city) {
      throw new Error('City name cannot be empty.');
    }

    const cities = await this.getCities();

    // Avoid duplicates
    if (cities.some((c) => c.name.toLowerCase() === city.toLowerCase())) {
      return;
    }

    const newCity = new City(city, uuidv4());
    const updatedCities = [...cities, newCity];
    await this.write(updatedCities);
  }

  // TODO: Define a getSearchHistory method to fetch the search history
  async getSearchHistory(): Promise<City[]> {
    return await this.getCities();
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city) => city.id !== id);

    if (cities.length === updatedCities.length) {
      return false; // No city was removed
    }

    await this.write(updatedCities);
    return true;
  }
}

export default new HistoryService();