# Funko Pop API

Este proyecto es una API para gestionar Funko Pops. La API permite agregar, actualizar, eliminar, listar y obtener información de los Funko Pops de cada usuario.

## Estructura del Proyecto

El proyecto se divide en las siguientes partes:

- `controllers`: Contiene la lógica principal de la aplicación.
- `models`: Define los tipos de datos utilizados en la aplicación.
- `routes`: Define las rutas de la API.
- `utils`: Proporciona funciones de utilidad relacionadas con el sistema de archivos.

## Models

### FunkoPop.ts

```typescript
export type FunkoPop = {
  id: number;
  name: string;
  description: string;
  type: string;
  genre: string;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
};
```

`FunkoPop` define el tipo de datos para un Funko Pop con las siguientes propiedades:

- `id`: Identificador único del Funko Pop.
- `name`: Nombre del Funko Pop.
- `description`: Descripción del Funko Pop.
- `type`: Tipo de Funko Pop (ej. Bobble-Head, Vinyl Figure).
- `genre`: Género al que pertenece el Funko Pop (ej. Anime, Películas).
- `franchise`: Franquicia a la que pertenece el Funko Pop (ej. Marvel, Star Wars).
- `number`: Número de serie del Funko Pop.
- `exclusive`: Si el Funko Pop es exclusivo o no.
- `specialFeatures`: Características especiales del Funko Pop.
- `marketValue`: Valor de mercado del Funko Pop.

### ResponseType.ts

```typescript
import { FunkoPop } from './FunkoPop.js';

export type ResponseType = {
  success: boolean;
  funkoPops?: FunkoPop[];
  message?: string;
};
```

`ResponseType` define el tipo de datos para las respuestas de la API, incluyendo:

- `success`: Indica si la operación fue exitosa o no.
- `funkoPops`: Una lista opcional de Funko Pops retornados por la operación.
- `message`: Un mensaje opcional proporcionado por la operación.

## Utils

### fileSystem.js

```typescript
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
```

`readFile` lee un archivo y devuelve su contenido como un objeto `Buffer`. Recibe como parámetro la ruta del archivo a leer.

```typescript
export async function writeFile(filePath: string, data: string): Promise<void> {
  try {
    await fs.writeFile(filePath, data);
  } catch (error) {
    throw error;
  }
}
```

`writeFile` escribe datos en un archivo. Recibe como parámetros la ruta del archivo y los datos a escribir.

```typescript
export async function createDirectory(directoryPath: string): Promise<void> {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    throw error;
  }
}
```

`createDirectory` crea un directorio de forma recursiva. Recibe como parámetro la ruta del directorio a crear.

```typescript
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    throw error;
  }
}
```

`deleteFile` elimina un archivo. Recibe como parámetro la ruta del archivo a eliminar.

```typescript
export async function readDirectory(directoryPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(directoryPath);
    return files;
  } catch (error) {
    throw error;
  }
}
```

`readDirectory` lee el contenido de un directorio y devuelve un array de nombres de archivos. Recibe como parámetro la ruta del directorio a leer.

## Controllers

### funkoController.ts

```typescript
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
```

Importamos las dependencias necesarias y definimos las variables para las rutas de archivo y directorio.

```typescript
export async function addFunko(user: string, funko: FunkoPop): Promise<ResponseType> {
  const userDirectory = path.join(funkoDirectory, user);
  const funkoFile = path.join(userDirectory, `${funko.id}.json`);

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
```

### updateFunko

```typescript
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
```

`updateFunko` actualiza un Funko Pop existente. Recibe como parámetros el nombre de usuario, el ID del Funko Pop y el objeto `Partial<FunkoPop>` con los campos actualizados. Retorna un objeto `ResponseType`.

### deleteFunko

```typescript
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
```

`deleteFunko` elimina un Funko Pop existente. Recibe como parámetros el nombre de usuario y el ID del Funko Pop. Retorna un objeto `ResponseType`.

### listFunkos

```typescript
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
```

`listFunkos` lista todos los Funko Pops de un usuario. Recibe como parámetro el nombre de usuario. Retorna un objeto `ResponseType`.

### getFunko

```typescript
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
```

`getFunko` obtiene un Funko Pop específico de un usuario. Recibe como parámetros el nombre de usuario y el ID del Funko Pop. Retorna un objeto `ResponseType`.

## Routes

### router

```typescript
import express from 'express';
import { addFunko, updateFunko, deleteFunko, listFunkos, getFunko } from '../controllers/funkoController.js';

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
  const funkoId = Number(req.params.funkoId);
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
  const funkoId = Number(req.params.funkoId);

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
  const funkoId = Number(req.params.funkoId);

  try {
    const result = await getFunko(user, funkoId);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as default };
```

En `routes`, se importa el módulo `express` y las funciones del controlador. Se crea un nuevo enrutador y se definen las rutas para las diferentes acciones: agregar, actualizar, eliminar, listar y obtener Funko Pops.

# server.js

El archivo `server.js` es el punto de entrada principal de la aplicación. Configura y ejecuta el servidor web utilizando el marco de Express y define la configuración y rutas de la aplicación.

```javascript
import express from 'express';
import cors from 'cors';
import funkoRoutes from './routes/funkoRoutes.js';

const app = express();
```

Se importan los módulos necesarios: `express`, `cors` y `funkoRoutes`. Luego, se crea una instancia de la aplicación Express.

```javascript
app.use(cors());
app.use(express.json());
```

Aquí, se utiliza el middleware `cors` para permitir solicitudes desde cualquier origen y se configura la aplicación para utilizar `express.json()` como middleware para analizar los cuerpos de las solicitudes entrantes en formato JSON.

```javascript
app.use('/funkos', funkoRoutes);
```

Se define un prefijo de ruta '/funkos' y se monta el enrutador importado desde `routes/funkoRoutes.js`.

```javascript
const PORT = process.env.PORT || 3000;
```

Se configura el puerto en el que se ejecutará el servidor. Si no se define la variable de entorno `PORT`, se utilizará el puerto 3000 por defecto.

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app as default };
```

Finalmente, se inicia el servidor en el puerto especificado y se muestra un mensaje en la consola. También se exporta la instancia de la aplicación Express como valor predeterminado para facilitar las pruebas y la importación en otros archivos.

# Pruebas
# Pruebas de rutas de Funko

Las pruebas realizadas en este archivo se enfocan en las rutas de la API relacionadas con los Funko Pops. Para ello, se utiliza la biblioteca de pruebas Chai y el complemento chai-http para realizar solicitudes HTTP a la API.

```javascript
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../dist/server.js';
import { FunkoPop } from '../dist/models/FunkoPop.js';
import {expect} from 'chai';

chai.use(chaiHttp);
```

Se importan las dependencias necesarias, incluyendo la aplicación Express y el modelo `FunkoPop`. Luego, se configura Chai para utilizar el complemento chai-http.

```javascript
describe('Funko routes', () => {
  //...
});
```

Se inicia el conjunto de pruebas llamado "Funko routes". A continuación, se detallan las pruebas de cada ruta.

## POST /:user

Esta ruta debe permitir agregar un nuevo Funko Pop. Se prueban dos casos: éxito al agregar un Funko Pop y falla si faltan campos requeridos.

## GET /:user

Esta ruta debe permitir listar todos los Funko Pops de un usuario. Se prueba que la respuesta sea exitosa y que devuelva una lista de Funko Pops.

## GET /:user/:funkoId

Esta ruta debe permitir obtener un único Funko Pop. Se prueban dos casos: éxito al obtener un Funko Pop y falla si el Funko Pop no existe.

## PATCH /:user/:funkoId

Esta ruta debe permitir actualizar un Funko Pop existente. Se prueban dos casos: éxito al actualizar un Funko Pop y falla si el Funko Pop no existe.

## DELETE /:user/:funkoId

Esta ruta debe permitir eliminar un Funko Pop existente. Se prueban dos casos: éxito al eliminar un Funko Pop y falla si el Funko Pop no existe.

Cada caso de prueba sigue un patrón similar: se realiza una solicitud HTTP a la ruta correspondiente y se comprueba la respuesta utilizando las funciones de aserción de Chai.