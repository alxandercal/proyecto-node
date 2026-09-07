import { db } from '../../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'

const productsColletion = db.collection('products')


function mapProduct(document) {
  if (!document.exists) {
    return null
  }

  const data = document.data()

  return {
    id: document.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null
  }
}

export async function createProduct(data) {
  const productRef = productsColletion.doc()
  await productRef.set({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  })
  const created = await productRef.get()

  return mapProduct(created)
}

export async function findProductById(id) {
  const product = await productsColletion.doc(id).get()
  return mapProduct(product)
}
export async function listProducts({ limit, active }) {
  let query = productsColletion.orderBy('createdAt', 'desc').limit(limit)

  if (active !== undefined) {
    query = productsColletion.where('active', '==', active).orderBy('createdAt', 'desc').limit(limit)
  }

  const products = await query.get()
  return products.docs.map(mapProduct)
}


export async function updateProduct(id, data) {
  const productToUpdate = productsColletion.doc(id)
  await productToUpdate.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp()
  })
  const product = await productToUpdate.get()
  return mapProduct(product)
}


export async function deleteProduct(id) {
  await productsColletion.doc(id).delete()
}

export async function findProductBySku(sku) {
  const product = await productsColletion.where('sku', '==', sku).limit(1).get()

  if (product.empty) {
    return null
  }

  return mapProduct(product.docs[0])
}
