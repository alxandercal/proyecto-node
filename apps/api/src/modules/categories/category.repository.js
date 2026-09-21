import {
  FieldValue
} from 'firebase-admin/firestore'

import {
  db
} from '../../config/firebase.js'

const categoriesCollection =
  db.collection('categories')

function mapTimestamp(
  value
) {
  return (
    value
      ?.toDate?.()
      ?.toISOString() ??
    null
  )
}

function mapCategory(
  document
) {
  if (!document.exists) {
    return null
  }

  const data =
    document.data()

  return {
    id:
      document.id,

    ...data,

    createdAt:
      mapTimestamp(
        data.createdAt
      ),

    updatedAt:
      mapTimestamp(
        data.updatedAt
      )
  }
}

export async function listCategories() {
  const snapshot =
    await categoriesCollection
      .orderBy(
        'name'
      )
      .get()

  return snapshot.docs.map(
    mapCategory
  )
}

export async function findCategoryById(
  id
) {
  const document =
    await categoriesCollection
      .doc(id)
      .get()

  return mapCategory(
    document
  )
}

export async function findCategoryBySlug(
  slug
) {
  const snapshot =
    await categoriesCollection
      .where(
        'slug',
        '==',
        slug
      )
      .limit(1)
      .get()

  return snapshot.empty
    ? null
    : mapCategory(
        snapshot.docs[0]
      )
}

export async function createCategory(
  data
) {
  const categoryRef =
    categoriesCollection.doc()

  await categoryRef.set({
    ...data,

    createdAt:
      FieldValue.serverTimestamp(),

    updatedAt:
      FieldValue.serverTimestamp()
  })

  return mapCategory(
    await categoryRef.get()
  )
}

export async function updateCategory(
  id,
  data
) {
  const categoryRef =
    categoriesCollection.doc(id)

  await categoryRef.update({
    ...data,

    updatedAt:
      FieldValue.serverTimestamp()
  })

  return mapCategory(
    await categoryRef.get()
  )
}

export async function deleteCategory(
  id
) {
  await categoriesCollection
    .doc(id)
    .delete()
}
