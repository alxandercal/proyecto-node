import { Router } from 'express'
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from './products.controller.js'
import { createProductSchema, listProductsSchema, productIdSchema, updateProductSchema } from './product.schema.js'
import { asyncHandler } from '../../shared/middleware/async-handler.js'
import { validate } from '../../shared/middleware/validate.middleware.js'
import { authorize } from '../../shared/middleware/authorized.middleware.js'
//import {authenticate} from '../../shared/middleware/authenticate.middleware.js' check

const router = Router()


// Rutas publicas
router.get('/', validate(listProductsSchema), asyncHandler(listProducts))
router.get('/:id', validate(productIdSchema), asyncHandler(getProduct))

// Rutas administrativas z
router.post('/',authorize('products:create'), validate(createProductSchema), asyncHandler(createProduct))
router.patch('/:id',authorize('products:update') ,validate(updateProductSchema), asyncHandler(updateProduct))
router.delete('/:id',authorize('products:delete'), validate(productIdSchema), asyncHandler(deleteProduct))

export default router
