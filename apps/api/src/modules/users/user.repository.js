import {FieldValue} from "firebase-admin/firestore"
import {db} from '../../config/firebase.js'

const userCollection =db.collection('users')

//funcion timestamp checa esto
function mapTimestamp(value) {
  return value?.toDate?.()?.toISOString() ?? null
}




function mapUser(document){
    if(!document.exists){
        return null
    }
    const data =document.data()

    return{
        id:document.id,
        email:data.email,
        name:data.name,
        role:data.role,
        active:data.active,
        createdAt:mapTimestamp(data.createdAt),
        updateAt:mapTimestamp(data.updateAt)
    }
}


export async function createUsers(data) {
    const user = userCollection.doc()
    await user.set({
        ...data,
        createdAt:FieldValue.serverTimestamp(),
        updateAt:FieldValue.serverTimestamp()
    })
    const created=await user.get()
    return mapUser(created)

}

export async function findById(id) {
    const doc = await userCollection.doc(id).get()
    return mapUser(doc)
}

export async function findByEmail(email) {
    const snapshot = await userCollection.where('email' , '==',email).limit(1).get()

    if(snapshot.empty){
        return null
    }

    const foundUser= snapshot.docs[0]

    return {
        ...mapUser(foundUser),
        passwordHash:foundUser.data().passwordHash
    }

}
