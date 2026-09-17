import * as productService from './product.service.js'

export async function listProducts(req, res) {
    console.log(req)
  const products = await productService.listProducts(req.validate.query)
  console.log('productos: ', products)
  return res.status(200).json({
    success: true,
    data: products,
    meta: {
      count: products.length,
      requestId: req.id
    }
  })
}

export async function getProduct(req, res) {
  const product = await productService.getProduct(req.validate.body)
  return res.status(200).json({
    success: true,
    data: product,
    meta: {
      requestId: req.id
    }
  })
}

export async function updateProduct(req, res) {
  const product = await productService.updateProduct(req.validate.params.
  id, req.validate.body)
  return res.status(200).json({
    success: true,
    data: product,
    meta: {
      requestId: req.id
    }
  })
}

export async function createProduct(req, res) {
  const product = await productService.createProduct(req.validate.body)
  return res.status(200).json({
    success: true,
    data: product,
    meta: {
      requestId: req.id
    }
  })
}

export async function deleteProduct(req, res) {
  await productService.deleteProduct(req.validate.params.id)
  return res.status(204).send()
}
