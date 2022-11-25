import { message } from 'antd'
import {
    collection,
    getDocs,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    orderBy
} from "firebase/firestore/lite";

export const getDocuments = async (db, col) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, orderBy('createdAt'))
        let result = await getDocs(myQuery)
        if (result.empty) {
            message.warning('The database is empty', 5)
            return new Promise(() => { })
        }
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const searchDocument = async (db, col, target, data) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, where(target, "==", data))
        let result = await getDocs(myQuery)
        console.log(result)
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}


export const checkDuplication = async (db, col, target, data) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, where(target, "==", data))
        let result = await getDocs(myQuery)
        console.log(result)
        if (!result.empty) {
            message.warning('Same data exists, please try again', 5)
            return new Promise(() => { })
        }
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const addDocument = async (db, col, data) => {
    try {
        let result = await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() })
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}


export const updateDocument = async (db, col, id, target, data) => {
    try {
        const myDoc = doc(db, col, id)
        const newFields = { [target]: data }
        let result = await updateDoc(myDoc, newFields)
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const deleteDocument = async (db, col, id) => {
    try {
        const myDoc = doc(db, col, id)
        let result = await deleteDoc(myDoc)
        return result;
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}
