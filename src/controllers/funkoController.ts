import { readFile, writeFile, createDirectory, deleteFile, readDirectory } from '../utils/fileSystem.js';
import path from 'path';
import { FunkoPop } from '../models/FunkoPop.js';
import { ResponseType } from '../models/ResponseType.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const funkoDirectory = join(__dirname, '../../funkos');


export async function addFunko(user: string, funko: FunkoPop): Promise<ResponseType> {
  const userDirectory = path.join(funkoDirectory, user);
  const funkoFile = path.join(userDirectory, `${funko.id}.json`);
  // Comprobar que todos los campos están rellenos
  if (!funko.name || !funko.description || !funko.type || !funko.genre || !funko.franchise || !funko.number || !funko.specialFeatures || !funko.marketValue) {
    return { success: false, message: 'All fields are required.' };
  }
  try {
    await createDirectory(userDirectory);
    await readFile(funkoFile);
    return { success: false, message: 'Funko Pop with the same ID already exists.' };
  } catch (error) {
    if (error.code === 'ENOENT') {
      const funkoData = JSON.stringify(funko, null, 2);
      await writeFile(funkoFile, funkoData);
      return { success: true, message: 'Funko Pop added successfully.' };
    } else {
      throw error;
    }
  }
}

export async function updateFunko(user: string, funkoId: number, updatedFunko: Partial<FunkoPop>): Promise<ResponseType> {
  const userDirectory = path.join(funkoDirectory, user);
  const funkoFile = path.join(userDirectory, `${funkoId}.json`);
  try {
    const funkoData = await readFile(funkoFile);
    const currentFunko = JSON.parse(funkoData.toString()) as FunkoPop;
    const newFunko = { ...currentFunko, ...updatedFunko };
    const newFunkoData = JSON.stringify(newFunko);
    await writeFile(funkoFile, newFunkoData);
    return { success: true, message: 'Funko Pop updated successfully.' };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: false, message: 'Funko Pop with the specified ID not found.' };
    } else {
      throw error;
    }
  }
}

export async function deleteFunko(user: string, funkoId: number): Promise<ResponseType> {
  const userDirectory = path.join(funkoDirectory, user);
  const funkoFile = path.join(userDirectory, `${funkoId}.json`);

  try {
    await deleteFile(funkoFile);
    return { success: true, message: 'Funko Pop deleted successfully.' };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: false, message: 'Funko Pop with the specified ID not found.' };
    } else {
      throw error;
    }
  }
}

export async function listFunkos(user: string): Promise<ResponseType> {
  const userDirectory = path.join(funkoDirectory, user);

  try {
    const files = await readDirectory(userDirectory);
    const funkoPromises = files.map(async (file) => {
      const funkoData = await readFile(path.join(userDirectory, file));
      return JSON.parse(funkoData.toString()) as FunkoPop;
    });
    const funkoPops = await Promise.all(funkoPromises);
    return { success: true, funkoPops };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: false, message: 'User not found.' };
    } else {
      throw error;
    }
  }
}

export async function getFunko(user: string, funkoId: number): Promise<ResponseType> {
  const userDirectory = path.join(funkoDirectory, user);
  const funkoFile = path.join(userDirectory, `${funkoId}.json`);

  try {
    const funkoData = await readFile(funkoFile);
    const funko = JSON.parse(funkoData.toString()) as FunkoPop;
    return { success: true, funkoPops: [funko] };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: false, message: 'Funko Pop with the specified ID not found.' };
    } else {
      throw error;
    }
  }
}
