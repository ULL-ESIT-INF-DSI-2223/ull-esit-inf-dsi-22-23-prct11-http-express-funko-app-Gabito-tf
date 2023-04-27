import express from 'express';
import { addFunko, updateFunko, deleteFunko, listFunkos, getFunko} from '../controllers/funkoController.js';

const router = express.Router();

router.post('/:user', async (req, res) => {
  const user = req.params.user;
  const funko = req.body;

  try {
    const result = await addFunko(user, funko);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:user/:funkoId', async (req, res) => {
  const user = req.params.user;
  const funkoId = req.params.funkoId;
  const updatedFunko = req.body;

  try {
    const result = await updateFunko(user, funkoId, updatedFunko);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:user/:funkoId', async (req, res) => {
  const user = req.params.user;
  const funkoId = req.params.funkoId;

  try {
    const result = await deleteFunko(user, funkoId);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:user', async (req, res) => {
  const user = req.params.user;

  try {
    const result = await listFunkos(user);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:user/:funkoId', async (req, res) => {
  const user = req.params.user;
  const funkoId = req.params.funkoId;

  try {
    const result = await getFunko(user, funkoId);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as default };
