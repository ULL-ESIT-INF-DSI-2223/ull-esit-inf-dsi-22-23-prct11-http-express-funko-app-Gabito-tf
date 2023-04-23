import express from 'express';
import cors from 'cors';
import funkoRoutes from './routes/funkoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/funkos', funkoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app as default };