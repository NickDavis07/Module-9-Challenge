import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
import weatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data

router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ message: 'City name is required.' });
    }
    const weatherData = await WeatherService.getWeatherByCity(city);

    // TODO: Save city to search history
    await HistoryService.addCityToHistory(city);
    res.status(200).json({ city, weatherData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to retrieve weather data.' });
  }
});


// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    // Fetch search history from HistoryService
    const history = await HistoryService.getSearchHistory();

    // Respond with search history
    res.status(200).json({ history });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to retrieve search history.' });
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate city ID
    if (!id) {
      return res.status(400).json({ message: 'City ID is required.' });
    }

    // Delete city from search history
    const success = await HistoryService.deleteCityFromHistory(id);

    if (success) {
      return res.status(200).json({ message: `City with ID ${id} successfully removed from history.` });
    } else {
      return res.status(404).json({ message: `City with ID ${id} not found.` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to delete city from search history.' });
  }
});


export default router;

