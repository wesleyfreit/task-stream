import multer from 'multer';
import { CsvParse } from '../lib/csv-parse.js';

const storage = new CsvParse();

export const multipart = multer({ storage });
