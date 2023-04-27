import express from 'express';
import cors from 'cors';
import funkoRoutes from './routes/funkoRoutes.js';
import { connect } from 'mongoose';

const app = express();

app.use(cors());
app.use(express.json());


connect('mongodb://127.0.0.1:27017/funko-pop').then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unable to connect to MongoDB server');
});

app.use('/funkos', funkoRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app as default };
export { server };