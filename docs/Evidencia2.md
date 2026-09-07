# Evidencia 2

Estas son las evidencias de lo que se trabajo en clase con respecto al proyecto del mono repo

## app.js

Aqui es donde se configura la aplicacion de express y con ayuda del prefijo llamamos a al contorlador de healt permitiendonos conseguir una respuesta y asi saber que nuestro servidor se encuentra activo.

```js
import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

//
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import router from "./routes/index.js";
import { errorMiddleware } from "./shared/middleware/error.middleware.js";
import { notFoundMiddleware } from "./shared/middleware/not-found.middleware.js";

export const app = express();
app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
    genReqId(req, res) {
      const existingRequestId = req.headers["x-powered-id"];
      const requestId =
        typeof existingRequestId === "string"
          ? existingRequestId
          : randomUUID();

      res.setHeader("x-request-id", requestId);
      return requestId;
    },
  }),
);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(
  express.json({
    limit: "1mb",
  }),
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb",
  }),
);
//aqui checa el prefijo
app.use(env.API_PREFIX, router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
```

## eslint

Aqui nosotros configuiramos eslint para poder ver nuestros errores en el proyecto y poder debugear.

```js
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
```

## nvmrc

con este archivo nos aseguramos de que siempre se va a estar trabajando con la misma version de node en este caso la 24.

```.nvmrc
24
```

## editorconfig

Aqui configuramos el editor asignando el numero de espacios por tabulacion y el utf.

```.editorconfig
root = true
[*]
charset = utf-8
end_of_line =lf
insert_final_newline = true
indent_style = space
ident_size = 4
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

```

## Usando es lint

Posterior a que todo esta bien configurado podemos usar lint desde la terminal integrada de VS utilizando el siguiente comando.

```bash
npm run lint
```

A continuacion nos aparecera los errores en caso de tenerlos.

## Corriendo el servidor en la terminal

Para poder iniciar el servidor es encesario utilizar el siguiente comando desde la terminal, previamente se correra lint y nos avisara de posibles errores.

Dentro de la misma teminal se nos mostrara el mensaje contenido en **server.js** el cual incluye el estado del server y que puerto esta utilizado.

```bash
    npm run dev
```

Para poder checar que el servidor esta activo en un buscador web se coloca la siguiente url **http://localhost:4050/api/v1**
Esto debido a que asi llamamos el prefijo de nuestra API.
