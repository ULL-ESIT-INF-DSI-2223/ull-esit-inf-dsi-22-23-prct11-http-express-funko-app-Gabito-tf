import User from '../models/userModel.js';
import { FunkoPop } from '../models/FunkoPop.js';

interface ResponseType {
  success: boolean;
  message: string;
  user?: any;
  funkoPops?: FunkoPop[];
}

export async function addFunko(user: string, funko: FunkoPop): Promise<ResponseType> {
  // Comprobar que todos los campos están rellenos
  if (!funko.name || !funko.description || !funko.type || !funko.genre || !funko.franchise || !funko.number || !funko.specialFeatures || !funko.marketValue) {
    return { success: false, message: 'All fields are required.' };
  }

  try {
    // Buscar al usuario o crear uno nuevo si no existe
    const foundUser = await User.findOneAndUpdate(
      { user },
      { $push: { funkos: funko } },
      { new: true, upsert: true }
    );
    return { success: true, message: 'Funko Pop added successfully.', user: foundUser };
  } catch (error) {
    console.error('Error adding Funko:', error);
    return { success: false, message: 'An error occurred while adding the Funko Pop.' };
  }
}

export async function updateFunko(user: string, funkoId: string, updatedFunko: Partial<FunkoPop>): Promise<ResponseType> {
  try {
    const foundUser = await User.findOne({ user });

    if (!foundUser) {
      return { success: false, message: 'User not found.' };
    }

    const funkoIndex = foundUser.funkos.findIndex((funko) => funko.id === funkoId);

    if (funkoIndex === -1) {
      return { success: false, message: 'Funko Pop with the specified ID not found.' };
    }

    Object.assign(foundUser.funkos[funkoIndex], updatedFunko);
    await foundUser.save();

    return { success: true, message: 'Funko Pop updated successfully.', user: foundUser };
  } catch (error) {
    console.error('Error updating Funko:', error);
    return { success: false, message: 'An error occurred while updating the Funko Pop.' };
  }
}

export async function deleteFunko(user: string, funkoId: string): Promise<ResponseType> {
  try {
    const foundUser = await User.findOne({ user });

    if (!foundUser) {
      return { success: false, message: 'User not found.' };
    }

    const funkoIndex = foundUser.funkos.findIndex((funko) => funko.id === funkoId);

    if (funkoIndex === -1) {
      return { success: false, message: 'Funko Pop with the specified ID not found.' };
    }

    foundUser.funkos.splice(funkoIndex, 1);
    await foundUser.save();

    return { success: true, message: 'Funko Pop deleted successfully.', user: foundUser };
  } catch (error) {
    console.error('Error deleting Funko:', error);
    return { success: false, message: 'An error occurred while deleting the Funko Pop.' };
  }
}

export async function listFunkos(user: string): Promise<ResponseType> {
  try {
  const foundUser = await User.findOne({ user });
  if (!foundUser) {
    return { success: false, message: 'User not found.' };
  }
  
  return {
    success: true,
    funkoPops: foundUser.funkos.map((funko) => ({
      id: funko.id,
      name: funko.name || "",
      description: funko.description || "",
      type: funko.type || "",
      genre: funko.genre || "",
      franchise: funko.franchise || "",
      number: funko.number || 0,
      specialFeatures: funko.specialFeatures || "",
      marketValue: funko.marketValue || 0,
      exclusive: funko.exclusive || false,
    })),
    message: 'Funko Pops listed successfully.',
  };  
} catch (error) {
  console.error('Error listing Funko Pops:', error);
  return { success: false, message: 'An error occurred while listing the Funko Pops.' };
  }
  }
  export async function getFunko(user: string, funkoId: string): Promise<ResponseType> {
    try {
      const foundUser = await User.findOne({ user });
  
      if (!foundUser) {
        return { success: false, message: 'User not found.' };
      }
  
      const funko = foundUser.funkos.find((funko) => funko.id === funkoId);
  
      if (!funko) {
        return { success: false, message: 'Funko Pop with the specified ID not found.' };
      }
  
      const convertedFunko: FunkoPop = {
        id: funko.id,
        name: funko.name || "",
        description: funko.description || "",
        type: funko.type || "",
        genre: funko.genre || "",
        franchise: funko.franchise || "",
        number: funko.number || 0,
        specialFeatures: funko.specialFeatures || "",
        marketValue: funko.marketValue || 0,
        exclusive: funko.exclusive || false,
      };
  
      return { success: true, message: "Funko Pop found successfully.", funkoPops: [convertedFunko] };
    } catch (error) {
      console.error('Error getting Funko Pop:', error);
      return { success: false, message: 'An error occurred while getting the Funko Pop.' };
    }
  }
  
 