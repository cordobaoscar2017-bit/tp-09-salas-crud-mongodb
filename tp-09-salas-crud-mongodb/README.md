TP09 - Actualización y eliminación de reservas con MongoDB

Descripción

Aplicación desarrollada con Node.js y Express para gestionar reservas de salas de estudio, incorporando persistencia de datos mediante MongoDB Atlas y Mongoose.

Este trabajo práctico amplía el TP08 e incorpora operaciones CRUD completas mediante una API HTTP, permitiendo crear, consultar, actualizar y eliminar reservas almacenadas en MongoDB.

La aplicación permite:

Consultar las reservas almacenadas en MongoDB.

Ver el detalle de una reserva.

Registrar nuevas reservas desde un formulario web.

Crear reservas mediante una API HTTP.

Actualizar reservas completas mediante PUT.

Modificar parcialmente reservas mediante PATCH.

Eliminar físicamente reservas mediante DELETE.

Validar los datos enviados mediante middleware.

Identificar cada reserva mediante un ID de MongoDB.

Filtrar reservas por sala.

Gestionar errores y respuestas HTTP.

Comprobar la conexión con MongoDB Atlas.

Mantener la persistencia de los datos después de reiniciar el servidor.

Instalación

Clonar o descargar el repositorio y ubicarse dentro de la carpeta del proyecto:

cd tp-09-salas-crud-mongodb

Instalar las dependencias:

npm install

Configuración de variables de entorno

Crear un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@CLUSTER/reservas_salas_u9

Reemplazar los datos de conexión por los correspondientes a la propia base de datos de MongoDB Atlas.

El archivo .env contiene información privada y no debe subirse al repositorio.

El archivo .env.example presenta un ejemplo de las variables necesarias sin incluir credenciales reales.

Ejecución de la aplicación

Para iniciar el servidor:

npm start

La aplicación estará disponible en:

http://localhost:3000

La conexión con MongoDB Atlas se establece antes de iniciar el servidor Express.

Comprobación del código

Para verificar la sintaxis de los archivos JavaScript:

npm run check

Para ejecutar ESLint:

npm run lint

Para aplicar el formato del proyecto:

npm run format

Rutas de la aplicación web

Método

Ruta

Descripción

GET

/

Página de inicio

GET

/estado

Estado del servicio

GET

/reservas

Listado de reservas

GET

/reservas/nueva

Formulario de nueva reserva

GET

/reservas/:id

Detalle de una reserva

POST

/reservas

Crear una nueva reserva

Configuración de MongoDB

La conexión con MongoDB Atlas se realiza mediante Mongoose.

La configuración se encuentra en:

src/config/base-datos.js

La URI de conexión se obtiene desde las variables de entorno definidas en .env.

Base de datos utilizada:

reservas_salas_u9

Colección utilizada:

reservas

Modelo de reserva

El modelo se encuentra en:

src/modelos/reservas.js

Cada reserva contempla los siguientes campos:

Campo

Tipo

Validación

estudiante

String

Obligatorio y sin espacios externos

email

String

Obligatorio y debe contener @

sala

String

Sala Norte, Sala Sur o Sala Multimedia

fecha

String

Obligatoria

turno

String

Mañana, Tarde o Noche

personas

Number

Número entero entre 1 y 6

estado

String

pendiente o confirmada

Al crear una reserva, el estado se establece automáticamente en pendiente.

El identificador de cada reserva se genera mediante MongoDB.

API HTTP de reservas

La API se encuentra disponible bajo la ruta base:

/api/reservas

Endpoints disponibles

Método

Ruta

Descripción

GET

/api/reservas

Listar todas las reservas

GET

/api/reservas/:id

Consultar una reserva por ID

POST

/api/reservas

Crear una nueva reserva

PUT

/api/reservas/:id

Reemplazar una reserva completa

PATCH

/api/reservas/:id

Actualizar parcialmente una reserva

DELETE

/api/reservas/:id

Eliminar una reserva

Filtrar reservas por sala

La API permite filtrar las reservas mediante el parámetro de consulta sala.

Ejemplo:

GET /api/reservas?sala=Sala%20Norte

Devuelve solamente las reservas correspondientes a la Sala Norte.

Crear una reserva mediante POST

Para registrar una reserva se utiliza el método POST y se envían los datos en formato JSON.

Ejemplo:

{
  "estudiante": "María López",
  "email": "maria.lopez@example.com",
  "sala": "Sala Sur",
  "fecha": "2026-11-20",
  "turno": "Tarde",
  "personas": 3
}

Si los datos son válidos, la API devuelve:

Código HTTP 201 (Created).

La reserva creada en formato JSON.

Una cabecera Location con la dirección del recurso creado.

El campo estado se establece automáticamente como pendiente.

Reemplazar una reserva mediante PUT

El método PUT permite reemplazar todos los campos editables de una reserva existente.

Se deben enviar todos los campos:

estudiante

email

sala

fecha

turno

personas

estado

Si la operación es correcta, devuelve HTTP 200 con la reserva actualizada.

Actualizar parcialmente mediante PATCH

El método PATCH permite modificar solamente los campos autorizados:

personas

estado

No es necesario enviar todos los datos de la reserva.

Ejemplo:

{
  "personas": 2
}

Los demás campos permanecen sin modificaciones.

Eliminar una reserva mediante DELETE

El método DELETE permite eliminar físicamente una reserva mediante su identificador.

Si la eliminación es correcta, devuelve HTTP 204 (No Content).

Si la reserva no existe, devuelve HTTP 404.

Validaciones de datos

La API incorpora middleware para validar la información recibida.

Se controlan las siguientes condiciones:

Los campos obligatorios deben estar presentes.

El correo electrónico debe contener el símbolo @.

La sala debe pertenecer a las opciones permitidas.

El turno debe ser válido.

La cantidad de personas debe ser un número entero entre 1 y 6.

El estado debe ser pendiente o confirmada cuando corresponda.

PUT debe recibir todos los campos editables.

PATCH solamente admite los campos personas y estado.

No se permiten propiedades desconocidas ni identificadores enviados por el cliente para modificar la reserva.

No se permiten cuerpos JSON vacíos, arreglos u objetos inválidos.

Los datos incorrectos generan una respuesta HTTP 400 sin modificar la reserva almacenada.

Manejo de errores HTTP

La API contempla las siguientes respuestas:

Código

Descripción

200

Consulta o actualización realizada correctamente

201

Reserva creada correctamente

204

Reserva eliminada correctamente

400

Datos incorrectos, JSON inválido o identificador mal formado

404

Reserva inexistente

500

Error interno del servidor

Las respuestas de error se presentan en formato JSON y no exponen información sensible del servidor.

Persistencia de datos

Tanto la aplicación web como la API HTTP utilizan MongoDB Atlas para almacenar y consultar las reservas.

Las reservas creadas desde el formulario web o mediante la API quedan almacenadas en la colección reservas.

Los datos permanecen disponibles aunque se detenga y vuelva a iniciar el servidor.

Las operaciones de actualización y eliminación se realizan sobre documentos identificados individualmente.

Pruebas de la API con Postman

Se creó una colección denominada:

TP9 - Reservas de salas

Se realizaron pruebas para comprobar:

Listar reservas mediante GET.

Crear una reserva mediante POST.

Consultar una reserva por ID.

Reemplazar todos los datos mediante PUT.

Modificar parcialmente una reserva mediante PATCH.

Eliminar una reserva mediante DELETE.

Comprobar que una reserva eliminada devuelve 404.

Verificar que los datos permanecen después de reiniciar el servidor.

Rechazar correos electrónicos inválidos.

Rechazar cantidades de personas superiores al máximo permitido.

Rechazar salas no autorizadas.

También se comprobó el funcionamiento de las páginas web: inicio, listado, detalle y formulario de creación de reservas.

Estructura principal del proyecto

tp-09-salas-crud-mongodb/
│
├── src/
│   ├── app.js
│   ├── index.js
│   │
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   │
│   ├── controladores/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   │
│   ├── middleware/
│   │   ├── reservas.js
│   │   ├── solicitudes.js
│   │   └── errores.js
│   │
│   ├── modelos/
│   │   └── reservas.js
│   │
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   │
│   └── servicios/
│       └── reservas.js
│
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reserva.js
│   └── listar-reservas.js
│
├── views/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

Tecnologías utilizadas

Node.js

Express

MongoDB Atlas

Mongoose

dotenv

EJS

express-ejs-layouts

Morgan

ESLint

HTML

CSS

Postman

Autor

Trabajo Práctico 09 - Actualización y eliminación de reservas con MongoDB.