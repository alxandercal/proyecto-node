import {FieldValue} from 'firebase-admin/firestore'
import {db} from '../../config/firebase.js'

const categoriesCollection = db.collection('categories')

//  check plis WTF whit this function
// function serverTimestamp(value) {
//   return value?.toDate?.()?.toISOString() ?? null
// }

function mapCategory(document) {
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




export async function listCategories() {
    const categories = await categoriesCollection.orderBy('name').get()
    return categories.docChanges.map(mapCategory)

}

export async function findCategoryById(id) {
  const category = await categoriesCollection.doc(id).get()
  return mapCategory(category)
}

export async function findCategoryBySlug(slug) {
    const category =await categoriesCollection.where('slug','==',slug).limit(1).get()
    return category.empty ? null : mapCategory(category.docs[0])
}


export async function createCategory(data) {
    const category = categoriesCollection.doc()
    await category.set({
        ...data,
        createdAt:FieldValue.serverTimestamp(),
        updatedAt:FieldValue.serverTimestamp()
    })
    return mapCategory(await category.get())
}


export async function updateCategory(id,data) {
    const category = categoriesCollection.doc()
    await category.update({
        ...data,
        updatedAt:FieldValue.serverTimestamp()
    })
    return mapCategory(await category.get())
}


export async function deleteCategory(id) {
    await categoriesCollection.doc(id).delete()
}
