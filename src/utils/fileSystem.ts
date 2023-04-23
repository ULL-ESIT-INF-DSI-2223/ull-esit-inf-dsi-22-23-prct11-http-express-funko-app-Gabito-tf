import fs from 'fs/promises';
import path from 'path';

export async function readFile(filePath: string): Promise<Buffer> {
  try {
    const data = await fs.readFile(filePath);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function writeFile(filePath: string, data: string): Promise<void> {
  try {
    await fs.writeFile(filePath, data);
  } catch (error) {
    throw error;
  }
}

export async function createDirectory(directoryPath: string): Promise<void> {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    throw error;
  }
}

export async function readDirectory(directoryPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(directoryPath);
    return files;
  } catch (error) {
    throw error;
  }
}
