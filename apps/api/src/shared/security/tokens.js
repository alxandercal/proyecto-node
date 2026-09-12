import {createHash} from 'node:crypto'
import jwt from 'jsonwebtoken'
import { authConfig } from '../../config/auth.js'

export function singAccessToken(payload){
    return jwt.sing(payload,authConfig.accessSecret,{
        expiresIn:authConfig.accessExpiresIn
    })
}

export function refreshToken(payload){
    return jwt.sing(payload,authConfig.refreshSecret,{
        expiresIn:authConfig.refreshExpiresIn
    })
}

export function verifyAccessToken(token){
    return jwt.verify(token,authConfig.accessSecret)
}

export function verifyRefreshToken(token){
    return jwt.verify(token,authConfig.refreshToken)
}

export function hashToken(token){
    return createHash('sha256').update(token).digest('hex')
}
