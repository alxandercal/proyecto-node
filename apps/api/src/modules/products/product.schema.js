import { z } from 'zod'

const productBodySchema = z.object({
  name: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(2000).default(''),
  price: z.number().finite().nonnegative(),
  stock: z.number().int().nonnegative(),
  category: z.string().trim().min(2).max(80),
  active: z.boolean().default(true)
})

const productIdParams = z.object({
  id: z.string().trim().min(1)
})

export const createProductSchema = z.object({
  body: productBodySchema,
  params: z.object({}),
  query: z.object({})
})

export const productIdSchema = z.object({
  body: z.object({}),
  params: productIdParams,
  query: z.object({})
})

export const updateProductSchema = z.object({
  body: productBodySchema.partial().refine((body) => {
    Object.keys(body).length > 0, {
      message: 'Se requiere mínimo un campo'
    }
  }),
  params: productIdParams,
  query: z.object({})
})

export const listProductsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    active: z.enum(['true', 'false']).optional().transform((value) => {
      value === undefined ? undefined : value === 'true'
    })
  })
})
