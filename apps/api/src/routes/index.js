import { Router } from 'express'
import healthRoutes from '../modules/health/health.routes.js'
import productsRoutes from '../modules/products/product.routes.js'
import authRoutes from '../modules/auth/auth.routes.js'
import userRoutes from '../modules/users/user.routes.js'
import categoryRoutes from '../modules/categories/category.routes.js'

const router = Router()

router.use('/', healthRoutes)
router.use('/auth',authRoutes)
router.use('/user',userRoutes)
router.use('/products',productsRoutes)
router.use('/categories',categoryRoutes)

export default router
