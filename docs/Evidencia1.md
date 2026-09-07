# Titulo principal
Para la actividad se creo el woplace de node donde se va a estar trabajando el backend de un ecomerce.


Codigo del middleware
```js
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath} from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const currentDirectory= path.dirname(currentFile)
const envPath= path.resolve(currentDirectory, '../../.env')

dotenv.config({
    path:envPath
})

const port = Number(process.env.PORT ?? 4000)

if (!Number.isInteger(port) || port< 1 || port>65535  ){
    throw new error('El puerto debe ser valido')
}

export const env = Object.freeze({
    NODE_ENV:process.env.NODE_ENV,
    PORT:port,
    API_PREFIX:process.env.API_PREFIX,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL:procces.env.LOG_LEVEL

})
```

logger.js
```js
import pino from 'pino'
import {env} from './env.js'

const transport = 
    env.NODE_ENV === 'production' ? undefined : pino.transport
    ({
        target:'pino-pretty',
        options:{
            colorize:true,
            translateTime:'SYS:standard',
            ignore:'pid,hostname'
        }
    })

    export const logger=pino({  
        level:env.LOG_LEVEL            
        }, transport)
        
```

healt controller.js
```js
import {env} from "../../config/env.js"

export function getHealt(req,res){
    return res.status(200).json({
        success:true,
        data:{
            service:'ecommerce-api',
            status:'ok',
            environment:env.NODE_ENV,
            uptime:Number(process.uptime().toFiced(2)),
            timestamp: new Date().toISOString()
        },
        meta:{
            RequestId:req.id
        }
    })
}
```


healt routes.js
```js
import {env} from "../../config/env.js"

export function getHealt(req,res){
    return res.status(200).json({
        success:true,
        data:{
            service:'ecommerce-api',
            status:'ok',
            environment:env.NODE_ENV,
            uptime:Number(process.uptime().toFiced(2)),
            timestamp: new Date().toISOString()
        },
        meta:{
            RequestId:req.id
        }
    })
}
```
index.js
```js
import {router} from 'express'
import {healtRoutes} from '../modules/healt/healt.routes.js'

const router= ROUTER()

router.get('/',getHealt)

export default router
```

errormiddleware.js
```js
import { logger } from "../../config/logger.js";

export function errorMiddleware (err,req,res_next){
    logger.error({
        err,
        requestId: req.id,
        method req.method,
        url: req.orignalUrl
    },'Unhandled applicartion error')
    
    return res_next.status(500).json({
        success:false,
        error:{
            code:'INTERNAL_SERVER_ERROR',
            message:process.env.NODE_ENV === 'production' ?
            'Internal Server Error' : err.message
        },
        meta:{
            requestId:req.id}
    })

}
```
notfound.js
```js
export function notFoundMiddleware(req,res){
    return res.status(404).json({
        success:false,
        errror:{
            code'ROUTE_NOT_FOUND',
            message: `Route ${req.method} ${reqoriginalUrl} notfound`
        },
        meta:{
            requestId:req.id
        }
    })
}
```
