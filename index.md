# Práctica 10 

Gabi Vacaru, alu0101098340
<br>
Desarrollo de Sistemas Informáticos


## Índice de contenidos<a name="id0"></a>
  - [Ejercicio 1](#id1)

  - [Ejercicio 2](#id2)

  - [Ejercicio 3](#id3)
    - [Clase](#id3.1)
    - [Servidor](#id3.2)
    - [Cliente](#id3.3)

  ### Ejercicio 1<a name="id1"></a>
  Nos encontramos con un programa que utiliza el módulo 'fs' de Node.js para monitorear cambios en un archivo específico. Al ejecutar el programa, teneoms que poner un nombre de archivo como argumento, este verifica si el archivo existe, en caso afirmativo, comienza a monitorearlo. Cada vez que el archivo se modifica, el programa muestra un mensaje en la consola informando que el archivo ha sido modificado de alguna manera.

    Para resumir el comportamiento de mismo lo voy a reducir a una tabla:

    | Paso | Pila de llamadas                     | Registro de eventos API| Cola de manejadores | Mensajes consola                                    |
    |------|--------------------------------------|------------------------|---------------------|-----------------------------------------------------|
    | 1    | Vacía                                |                        |                     |                                                     |
    | 2    | Función de devolución de llamada     |                        |                     |                                                     |
    | 3    | Vacía                                |                        |                     | "Starting to watch file helloworld.txt"             |
    | 4    |                                      | Evento 'change'        |                     | "File helloworld.txt is no longer watched"          |
    | 5    |                                      |                        | Manejador 'change'  |                                                     |
    | 6    | Manejador de eventos 'change'        |                        |                     | "File helloworld.txt has been modified somehow" (1) |
    | 7    | Vacía                                |                        |                     |                                                     |
    | 8    |                                      |                        | Manejador 'change'  |                                                     |
    | 9    | Manejador de eventos 'change'        |                        |                     | "File helloworld.txt has been modified somehow" (2) |
    | 10   | Vacía                                |                        |                     |                                                     |

La función access en el módulo 'fs' de Node.js se utiliza para verificar si un archivo existe y si se puede acceder con los permisos requeridos. La función access es asíncrona y acepta una función de devolución de llamada (callback) que se ejecuta cuando se completa la verificación.

En el programa proporcionado, la función access se llama con los argumentos filename, constants.F_OK y una función de devolución de llamada. La función verifica si el archivo filename existe utilizando la flag constants.F_OK.

El objeto constants es parte del módulo 'fs' y contiene constantes relacionadas con el módulo. Estas constantes incluyen flags de acceso a archivos y otras constantes utilizadas en las operaciones de archivos. En este caso, se utiliza constants.F_OK para la comprobación de la existencia del archivo en la función access. constants.F_OK es una flag que indica que la función access debe verificar solo la existencia del archivo, independientemente de si se puede leer, escribir o ejecutar.

### Ejercicio 2<a name="id2"></a>

En este ejercicio, se nos pide que creemos un programa que dado un archivo por consola, ejecute el comando WC, para poder contar en número de líneas, palabras y caracteres que tiene el archivo. Tambien se nos pide que realizemos el programa de dos formas distinas, una de ellas usando pipes y la otra usando streams.

Para ejecutar el programa, debemos poner el siguiente comando en la consola:
```typescript
    node dist/ejercicio2.js <nombre_archivo> --pipe --lineas --palabras --caracteres
```
En cuanto al código del mismo importamos los módulos necesarios para poder ejecutar el programa, en este caso, los módulos 'fs' y 'yargs' de Node.js. También importamos la función spawn del módulo 'child_process' de Node.js, que se utiliza para ejecutar comandos en una nueva terminal.
```typescript
    import fs from "fs";
    import yargs from "yargs/yargs";
    import { hideBin } from "yargs/helpers";
    import { spawn } from "child_process";
```

Luego hemos creado una interfaz para poder definir los argumentos que se le pasan al programa, en este caso, el nombre del archivo y las flags que se le pasan al programa para que nos muestre el número de líneas, palabras y caracteres que tiene el archivo.
```typescript
        interface Opciones {
    _: string[];
    $0: string;
    lineas?: boolean;
    palabras?: boolean;
    caracteres?: boolean;
    pipe?: boolean;
    }
```

Para poder ejecutar esto desde terminal, hemos configurado el yards:
```typescript
        const opciones: Opciones = yargs(hideBin(process.argv))
    .usage("Uso: node $0 <Archivo> [opciones]")
    .option("pipe", {
        alias: "p",
        describe: "Utilizar método pipe",
        type: "boolean",
    })
    .option("lineas", {
        alias: "l",
        describe: "Ver número de líneas",
        type: "boolean",
    })
    .option("palabras", {
        alias: "w",
        describe: "Ver número de palabras",
        type: "boolean",
    })
    .option("caracteres", {
        alias: "c",
        describe: "Ver número de caracteres",
        type: "boolean",
    })
    .demandCommand(1).argv as unknown as Opciones;
```
En este caso, hemos definido que el programa necesita un argumento obligatorio, que es el nombre del archivo, y que además, se le pueden pasar las flags que hemos definido en la interfaz.

En cuanto a la funcion principal del programa, es decir la ejecucion del conmando WC, primero comprobamos si el archivo existe, en caso afirmativo, ejecutamos el comando WC, en caso contrario, mostramos un mensaje de error.
En caso de que el archivo exista y se le hayan pasado las flags, guardamos los flags en un vector de flags, y ejecutamos el comando WC con las flags correspondntes siempre y cuando se haya pasado mínimo una. El orden es indiferente.

Una vez lanzado el spawn, se comprueba si se ha pasado el flag --pipe, en caso afirmativo, se utiliza el método pipe para mostrar el resultado por pantalla, en caso contrario, se utiliza el método on para mostrar el resultado por pantalla.

```typescript
        fs.access(archivo, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`El archivo ${archivo} no existe`);
        process.exit(1);
    } else {
        const wcOpciones: string[] = [];

        if (opciones.lineas) wcOpciones.push("-l");
        if (opciones.palabras) wcOpciones.push("-w");
        if (opciones.caracteres) wcOpciones.push("-c");

        if (wcOpciones.length === 0) {
        console.error(
            "Debe especificar al menos una opcion: --lineas, --palabras o --caracteres"
        );
        process.exit(1);
        } else {
        const wc = spawn("wc", wcOpciones.concat(archivo));

        if (opciones.pipe) {
            console.log("Utilizando método pipe");
            wc.stdout.pipe(process.stdout);
            wc.stderr.pipe(process.stderr);
        } else {
            console.log("Utilizando método on");
            wc.stdout.on("data", (data) => {
            process.stdout.write(data);
            });

            wc.stderr.on("data", (data) => {
            process.stderr.write(data);
            });
        }
        }
    }
    });
```
### Ejercicio 3<a name="id3"></a>
En el ejercicio 3, se nos pide que cambiemos lo realizado en la práctica anterior a servidores con sockets.
#### Clase<a name="id3.1"></a>
Seguimos manteniendo la misma clase Funko de la práctica pasada, no hay nada que cambiar.
#### Servidor<a name="id3.2"></a>
En el servidor, lo primero que hacemos es importar los módulos necesarios para poder ejecutar el programa, en este caso, los módulos 'fs' y 'net' de Node.js. También importamos la clase Funko del archivo 'funko.ts' que hemos creado en el ejercicio anterior.
```typescript
    import fs from "fs";
    import net from "net";
    import { Funko } from "./funko";
```
Tambien se ha creado una interfaz para poder definir correctamente los mensajes que se envian entre el cliente y el servidor.
```typescript
interface Message {
  [key: string]: any;
  usuario: string;
  tipo: string;
  command: string;
  id?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  genero?: string;
  franquicia?: string;
  numero?: string;
  exclusivo?: boolean;
  caracteristicasEspeciales?: string;
  valor?: number;
}
```

Aqui hemos tenido que crear un servidor en el puerto 3000, el cual contiene un switch case con todas las peticiónes que se pueden hacer al servidor. En este caso, se han implementado las siguientes peticiones:
```typescript
   const server = net.createServer((connection) => {
  console.log('Client connected');

  connection.on('data', (data) => {
    const message = JSON.parse(data.toString()) as Message;
    const dirPath = `users/${message.usuario}`;

    switch (message.command) {
      case 'read':
        readFunko(message, connection, dirPath);
        break;
      case 'list':
        listFunkos(message, connection, dirPath);
        break;
      case 'remove':
        removeFunko(message, connection, dirPath);
        break;
      case 'update':
        updateFunko(message, connection, dirPath);
        break;
      case 'add':
        addFunko(message, connection, dirPath);
        break;
      default:
        const noExisteAccion = chalk.red.bold('Tipo de acción no reconocida');
        connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteAccion }) + '\n');
        break;
    }
  });

  connection.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening at port 3000');
});
```

Una vez solicitado un commando, este ejecutará su correspondiente funcion.
readFunko(message, connection, dirPath);
```typescript
function readFunko(message: Message, connection: net.Socket, dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    let found = false;
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = `${dirPath}/${file}`;
      const data = fs.readFileSync(filePath, 'utf-8');
      const funkoJSON = JSON.parse(data);
      if (funkoJSON.id === message.id) {
        const funko = new Funko(funkoJSON.id, funkoJSON.nombre, funkoJSON.descripcion, funkoJSON.tipo, funkoJSON.genero, funkoJSON.franquicia, funkoJSON.numero, funkoJSON.exclusivo, funkoJSON.caracteristicasEspeciales, funkoJSON.valor);
        connection.write(JSON.stringify({ 'type': 'reply', 'output': funko.print() }) + '\n');
        found = true;
        console.log(`Se ha enviado la información del funko ${funkoJSON.id} al cliente.`);
      }
    });
    if (found == false) {
      const noExisteFunko = chalk.red(`No existe ningún funko con el ID = ${message.id} en la colección de ${message.usuario}`);
      connection.write(JSON.stringify({ 'type': 'reply', 'output':noExisteFunko }) + '\n');
    }
  } else {
    const noExisteColeccion = chalk.red(`El usuario ${message.usuario} no tiene una colección`);
    connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteColeccion }) + '\n');
    return;
  }
}
```
Aqui se ha creado una funcion para leer un funko, en el cual se comprueba si existe la carpeta del usuario, si existe, se comprueba si existe el funko con el id que se ha pasado por el mensaje, si existe, se crea un objeto de la clase Funko y se envia al cliente, si no existe, se envia un mensaje de error al cliente.

#### listFunkos(message, connection, dirPath);
```typescript
function listFunkos(message: Message, connection: net.Socket, dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    connection.write(JSON.stringify({ 'type': 'reply', 'output': `${message.usuario} Funko Pop collection\n----------------------------` }) + '\n');
    let output = "";
    files.forEach(file => {
      const filePath = `${dirPath}/${file}`;
      const data = fs.readFileSync(filePath, 'utf-8');
      const funkoJSON = JSON.parse(data);
      const funko = new Funko(funkoJSON.id, funkoJSON.nombre, funkoJSON.descripcion, funkoJSON.tipo, funkoJSON.genero, funkoJSON.franquicia, funkoJSON.numero, funkoJSON.exclusivo, funkoJSON.caracteristicasEspeciales, funkoJSON.valor);
      output += funko.print() + '\n----------------------------\n';
    });
    connection.write(JSON.stringify({ 'type': 'reply', 'output': output }) + '\n');
    console.log(`Se ha enviado la lista de los funkos de ${message.usuario} al cliente.`);
  } else {
    const noExisteColeccion = chalk.red(`El usuario ${message.usuario} no tiene una colección`);
    connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteColeccion }) + '\n');
    return;
  }
}
```
Aqui se ha creado una funcion para listar todos los funkos de un usuario, en el cual se comprueba si existe la carpeta del usuario, si existe, se envia un mensaje al cliente con el nombre de la colección, y se envia un mensaje por cada funko que se encuentre en la carpeta del usuario.
#### removeFunko(message, connection, dirPath);
```typescript
function removeFunko(message: Message, connection: net.Socket, dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    let found = false;
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = `${dirPath}/${file}`;
      const data = fs.readFileSync(filePath, 'utf-8');
      const funkoJSON = JSON.parse(data);
      if (funkoJSON.id === message.id) {
        fs.unlinkSync(filePath);
        const eliminadoCorrectamente = chalk.green("Se ha eliminado correctamente el Funko con el ID = " + message.id + " en la colección de " + message.usuario);
        connection.write(JSON.stringify({ 'type': 'reply', 'output': eliminadoCorrectamente }) + '\n');
        found = true;
      }
    });
    if (found == false) {
      const noExisteFunko = chalk.red(`No existe ningún funko con el ID = ${message.id} en la colección de ${message.usuario}`);
      connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteFunko }) + '\n');
    }
  } else {
    const noExisteColeccion = chalk.red(`El usuario ${message.usuario} no tiene una colección`);
    connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteColeccion }) + '\n');
    return;
  }
}
```
Aquí se ha creado una funcion para eliminar un funko, en el cual se comprueba si existe la carpeta del usuario, si existe, se comprueba si existe el funko con el id que se ha pasado por el mensaje, si existe, se elimina el funko, si no existe, se envia un mensaje de error al cliente.
#### updateFunko(message, connection, dirPath);
```typescript
function updateFunko(message: Message, connection: net.Socket, dirPath: string): void {
  let exist = false;
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = `${dirPath}/${file}`;
      const data = fs.readFileSync(filePath, 'utf-8');
      const funkoJSON = JSON.parse(data);
      if (funkoJSON.id === message.id) {
        exist = true;
        for (const key in funkoJSON) {
          if (message[key] !== undefined) {
            funkoJSON[key] = message[key];
          }
        }
        fs.writeFileSync(filePath, JSON.stringify(funkoJSON, null, 2));
        const actualizadoCorrectamente = chalk.green(`El Funko con el ID = ${message.id} ha sido actualizado en la colección de ${message.usuario}`);
        connection.write(JSON.stringify({ 'type': 'reply', 'output': actualizadoCorrectamente }) + '\n');
      }
    });
    if (!exist) {
      const noExisteFunko = chalk.red(`No existe ningún funko con el ID = ${message.id} en la colección de ${message.usuario}`);
      connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteFunko }) + '\n');
    }
  } else {
    const noExisteColeccion = chalk.red(`El usuario ${message.usuario} no tiene una colección`);
    connection.write(JSON.stringify({ 'type': 'reply', 'output': noExisteColeccion }));
    return;
  }
}
```
Aquí se ha creado una funcion para actualizar un funko, en el cual se comprueba si existe la carpeta del usuario, si existe, se comprueba si existe el funko con el id que se ha pasado por el mensaje, si existe, se actualizan las propiedades del funko, si no existe, se envia un mensaje de error al cliente.
#### addFunko(message, connection, dirPath);
```typescript
function addFunko(message: Message, connection: net.Socket, dirPath: string): void {
  let exist = false;
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = `${dirPath}/${file}`;
      const data = fs.readFileSync(filePath, 'utf-8');
      const funkoJSON = JSON.parse(data);
      if (funkoJSON.id === message.id) {
        const yaExisteFunko = chalk.red(`Ya existe un Funko con el ID = ${message.id} en la colección de ${message.usuario}`);
        connection.write(JSON.stringify({ 'type': 'reply', 'output': yaExisteFunko }) + '\n');
        exist = true;
      }
    });

    if (exist === false) {
      const funkosJSON = {
        id: message.id,
        nombre: message.nombre,
        descripcion: message.descripcion,
        tipo: message.tipo,
        genero: message.genero,
        franquicia: message.franquicia,
        numero: message.numero,
        exclusivo: message.exclusivo,
        caracteristicasEspeciales: message.caracteristicasEspeciales,
        valor: message.valor
      }
      fs.writeFileSync(`${dirPath}/${message.id}.json`,
      JSON.stringify(funkosJSON, null, 2));
      const success = chalk.green('Se ha agregado el Funko con el ID = ' + message.id + ' a la colección de ' + message.usuario + '\n');
      connection.write(JSON.stringify({ 'type': 'reply', 'output': success}));
    }
  } else {
    fs.mkdirSync(dirPath);
    const funkosJSON = {
      id: message.id,
      nombre: message.nombre,
      descripcion: message.descripcion,
      tipo: message.tipo,
      genero: message.genero,
      franquicia: message.franquicia,
      numero: message.numero,
      exclusivo: message.exclusivo,
      caracteristicasEspeciales: message.caracteristicasEspeciales,
      valor: message.valor
    }
    fs.writeFileSync(`${dirPath}/${message.nombre}.json`, JSON.stringify(funkosJSON, null, 2));
    const success = chalk.green('Se ha agregado el Funko con el ID = ' + message.id + ' a la colección de ' + message.usuario + '\n');
    connection.write(JSON.stringify({ 'type': 'reply', 'output': success }) + '\n');
  }
```
Aquí se ha creado una funcion para añadir un funko, en el cual se comprueba si existe la carpeta del usuario, si existe, se comprueba si existe el funko con el id que se ha pasado por el mensaje, si existe, se envia un mensaje de error al cliente, si no existe, se añade el funko, si no existe la carpeta del usuario, se crea la carpeta y se añade el funko.

## 4.3. Cliente
En cuanto al cliente se ha creado una conexion al puerto 3000 para poder comunicarse con el servidor. Aqui se ha usado yargs para poder pasar los argumentos por consola.
```typescript
yargs(hideBin(process.argv))
  .command('add', 'Adds a funko', { ...commonOptions, ...addOptions }, handleAddCommand)
  .command('update', 'update a funko', { ...commonOptions, ...optionalAddOptions }, handleUpdateCommand)
  .command('remove', 'Remove a funko from the collection', commonOptions, handleRemoveCommand)
  .command('list', 'List a funko collection', { usuario: commonOptions.usuario }, handleListCommand)
  .command('read', 'Show a concrete funko from the collection', commonOptions, handleReadCommand)
  .help()
  .argv;
```
Para cada comando se ha creado una funcion que se encarga de enviar el mensaje al servidor. En cada comando hay que poner los argumentos que se van a pasar por consola. He observado que hay dos que se repiten prácticamente en todas las funciones, el usuario y el id, por lo que he creado un objeto con las opciones comunes.
```typescript
const commonOptions = {
  id: {
    description: 'Funko ID',
    type: 'number' as const,
    demandOption: true,
  },
  usuario: {
    description: 'User',
    type: 'string' as const,
    demandOption: true,
  },
};
```
Y otro objeto con las opciones que se repiten en los comandos add y update.
```typescript
const addOptions = {
  nombre: {
    description: 'Funko Name',
    type: 'string' as const,
    demandOption: true,
  },
  descripcion: {
    description: 'Funko description',
    type: 'string' as const,
    demandOption: true,
  },
  tipo: {
    description: 'Funko tipo',
    type: 'string' as const,
    demandOption: true,
  },
  genero: {
    description: 'Genero de la serie',
    type: 'string' as const,
    demandOption: true,
  },
  franquicia: {
    description: 'Funko franquicia',
    type: 'string' as const,
    demandOption: true,
  },
  numero: {
    description: 'Numero de la serie',
    type: 'number' as const,
    demandOption: true,
  },
  exclusivo: {
    description: 'Es exclusivo',
    type: 'boolean' as const,
    demandOption: true,
  },
  caracteristicasEspeciales: {
    description: 'Caracteristicas especiales del funko',
    type: 'string' as const,
    demandOption: true,
  },
  valor: {
    description: 'Valor del funko',
    type: 'number' as const,
    demandOption: true,
  },
};
```
Dejando de esta manera un código más limpio, ordenado y legible.
#### handleAddCommand
```typescript
const handleAddCommand = (argv: Arguments) => {
  client.write(JSON.stringify({
    'type': 'command', 'command': 'add', 'usuario': argv.usuario, 'id': argv.id, 'nombre': argv.nombre, 'descripcion': argv.descripcion, 'tipo': argv.tipo, 'genero': argv.genero, 'franquicia': argv.franquicia, 'numero': argv.numero, 'exclusivo': argv.exclusivo, 'caracteristicasEspeciales': argv.caracteristicasEspeciales, 'valor': argv.valor
  }));

  client.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    if (message.type === 'reply') {
      console.log(message.output);
    }
  });
};
```
#### handleUpdateCommand
```typescript
const handleUpdateCommand = (argv: Arguments) => {
  client.write(JSON.stringify({
    'type': 'command', 'command': 'update', 'usuario': argv.usuario, 'id': argv.id, 'descripcion': argv.descripcion, 'tipo': argv.tipo, 'genero': argv.genero, 'franquicia': argv.franquicia, 'numero': argv.numero, 'exclusivo': argv.exclusivo, 'caracteristicasEspeciales': argv.caracteristicasEspeciales, 'valor': argv.valor
  }));

  client.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    if (message.type === 'reply') {
      console.log(message.output);
    }
  });
};
```
#### handleRemoveCommand
```typescript
const handleRemoveCommand = (argv: Arguments) => {
  client.write(JSON.stringify({ 'type': 'command', 'command': 'remove', 'usuario': argv.usuario, 'id': argv.id }));

  client.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    if (message.type === 'reply') {
      console.log(message.output);
    }
  });
};
```
#### handleListCommand
```typescript
const handleListCommand = (argv: Arguments) => {
  client.write(JSON.stringify({ 'type': 'command', 'command': 'list', 'usuario': argv.usuario, 'id': argv.id }));

  client.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    if (message.type === 'reply') {
      console.log(message.output);
    }
  });
};
```
#### handleReadCommand
```typescript
function handleReadCommand(argv: Arguments): void {
  client.write(JSON.stringify({ type: 'command', command: 'read', usuario: argv.usuario, id: argv.id }));

  client.on('data', (dataJSON) => {
    const message = JSON.parse(dataJSON.toString());
    if (message.type === 'reply') {
      console.log(message.output);
    }
  });
}
```

Aquí realmente todas las funciones son iguales, solo cambia el comando que se envía al servidor. En cada función se crea un objeto con los argumentos que se van a pasar por consola y se envía al servidor. En el servidor se recibe el mensaje y se ejecuta la función correspondiente.

En cuanto a las actions de github, no me ha dado tiempo ya que para los tests hay que hacer dos workflows en paralelo, uno para el servidor y otro para el cliente. Y no he tenido tiempo de hacerlo.