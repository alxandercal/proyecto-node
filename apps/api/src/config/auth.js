import {env} from './env.js'


if(!env.JWT_ACCESS_SECRET ){
    throw new Error('JWT_ACCESS_SECRET es requerido')
}

if(!env.JWT_REFRESH_SECRET){
    throw new Error('JWT_REFRESH_SECRET es requerido')
}


export const authConfig=Object.freeze({
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret:env.JWT_REFRESH_SECRET,
    accessExpiresIn:env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn:env.JWT_REFRESH_EXPIRES_IN
})

