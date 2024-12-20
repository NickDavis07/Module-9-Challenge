import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response} from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (_req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../../../client/dist/index.html');
    res.sendFile(filePath);
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).send('Failed to serve the requested file.');
  }
});

export default router;
