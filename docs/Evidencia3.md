# Evidencia 3

Creamos la consola de firebase y he intalamos todo lo necesario para poder utilizarlo como desarrollador

```bash
npm install firebase-admin zod --workspace@=ecomerce/api
```

```bash
$env:GOOGLE_APPLICATION_CREDENTIALS="$PWD/apps/api/secrets/firebase-service-account.json"
```

SE añadieron las ceredenciales de firebase al .env y ademas se agrego al env.js

```js
export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,
  PORT: port,
  API_PREFIX: process.env.API_PREFIX,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  LOG_LEVEL: process.env.LOG_LEVEL,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
});

if (!env.FIREBASE_PROJECT_ID) {
  throw new Error("Falta la variable de entorno FIREBASE_PROJECT_ID");
}
```

Se configuro el archivo de firabase js.
este hace uso de la instancia de firebase.

```js
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/gerFirestore";
import { env } from "./env.js";

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        projectId: env.FIREBASE_PROJECT_ID,
      });

export const db = getFirestore(firebaseApp);
```

Se agrego la carpeta de productos con los respectivos archivos que necesita.

Se creo la funcion de errores para poder normalizar los errores de codigo

```js
export class AppError extends Error {
  constructor({ statusCode, code, message, details }) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.details = details;
  }
}
```

se relizo la funcion del handler del middleware

```js
export function asyncHandler(handler) {
  return function wrapperHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next); //checa este pedazo probablememnte esta mal
  };
}
```

validate.middleware.js

```js
import {zodError} from 'zod'
import { AppError} from '../errors/app-error.js'

export function validate(schema){
    return function validationMiddleware(
        req,_res,next
    ){
        try {
            const result =schema.parse({
                body= req.body,
                params= req.params,
                query= req.query
            })
            req.validated =result
            next()
        } catch (error) {
            if(error instanceof ZodError){
                new AppError({
                    statusCode:400,
                    code:'VALIDATION_ERROR',
                    message:'Request Validation failed',
                    details:error.issues
                })
            }
        }
    }
}

```

Ademas se agregaron las siguientes lineas al error del middleware

```js
import { logger } from "../../config/logger.js";
import { env } from "../../";
import { AppError } from "../errors/app-error.js";
import { success } from "zod";

// checar esta funcion
export function errorMiddleware(err, req, res, _next) {
  if (err instanceof AppError) {
    logger.warm(
      {
        code: err.code,
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        details: err.details,
      },
      err.message,
    );
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.deatils ? { details: err.details } : {}),
      },
      meta: {
        requestId: req.id,
      },
    });
  }
}
```
