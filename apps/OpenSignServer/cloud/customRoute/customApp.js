import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadFile from './uploadFile.js';
import { validateApiToken } from './apiAuth.js';
import requestSignature from './requestSignature.js';

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/file_upload', uploadFile);

// External integration API (requires x-api-token)
app.post('/api/v1/request-signature', validateApiToken, requestSignature);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'instasign-api-v1' });
});
