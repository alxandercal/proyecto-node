import { Router } from 'express'
import healthRoutes from '../modules/health/health.routes.js'
import productsRoutes from '../modules/products/product.routes.js'

const router = Router()

router.get('/', healthRoutes)
router.get('/product',productsRoutes)

export default router
