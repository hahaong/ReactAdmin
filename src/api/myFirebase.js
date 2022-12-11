import { message } from 'antd'
import {
    collection,
    getDoc,
    getDocs,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    orderBy,
    getCount,
    limit,
    startAt,
    endAt
} from "firebase/firestore/lite";

import dayjs from "dayjs";

import { db, PAGE_SIZE } from "../config"


export const getDocuments = async (col) => {
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
        console.log(error.message)
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const searchDocument = async (col, target, data) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, where(target, "==", data))
        let result = await getDocs(myQuery)
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const searchDocumentById = async (col, id) => {
    try {
        let myDoc = doc(db, col, id);
        let result = await getDoc(myDoc)
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}


export const checkDuplication = async (col, target, data) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, where(target, "==", data))
        let result = await getDocs(myQuery)
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

export const addDocument = async (col, data) => {
    try {
        let result = await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() })
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}


export const updateDocument = async (col, id, fields) => {
    try {
        const myDoc = doc(db, col, id)
        let result = await updateDoc(myDoc, fields)
        return result
    } catch (error) {
        console.log(error)
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const deleteDocument = async (col, id) => {
    try {
        const myDoc = doc(db, col, id)
        let result = await deleteDoc(myDoc)
        return result;
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

//get total data count of a collection
export const getTotalCount = async (col) => {
    try {
        const snapshot = await getCount(collection(db, col));
        return snapshot.data().count;
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

//currentPageNum and totalPageNumber is important to do number pagination
export const pagination = async (col, target, currentPageNum, searchType = "", keyword = "") => {
    try {
        let requestDataNumber = currentPageNum * PAGE_SIZE
        let total
        let myQuery
        let result
        let resultSize
        if (keyword == "") {
            total = await getCount(query(collection(db, col)))
            myQuery = query(collection(db, col), orderBy(target, "desc"), limit(requestDataNumber))
            total = total.data().count
            result = await getDocs(myQuery);
            resultSize = result.size
            // result.forEach((item) => {
            //     console.log({
            //         ...item.data(), createdAt: dayjs(item.data().createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss")
            //     })
            // })
        }

        else {
            // console.log("myFirebase Search function...")
            total = await getCount(query(collection(db, col), orderBy(searchType), startAt(keyword)))
            total = total.data().count
            myQuery = query(collection(db, col), orderBy(searchType), startAt(keyword), endAt(keyword), limit(requestDataNumber))
            result = await getDocs(myQuery);
        }

        if (result.empty) {
            message.warning('Data not found, please try again', 5)
            return {
                currentPageData: [],
                currentPageNumber: currentPageNum,
                totalPageNumber: 0
            }
            // return new Promise(() => { })
        }

        let currentPageInfo = (resultSize % PAGE_SIZE == 0) ?
            {
                currentPageData: result.docs.splice(-PAGE_SIZE),
                currentPageNumber: currentPageNum,
                totalPageNumber: total
            } : {
                currentPageData: result.docs.splice(-(resultSize % PAGE_SIZE)),
                currentPageNumber: currentPageNum,
                totalPageNumber: total
            }
        // console.log("target", target)
        // console.log("currentPageNum", currentPageNum)
        // console.log("requestDataNumber", requestDataNumber)
        // console.log("searchType", searchType)
        // console.log("keyword", keyword)
        // console.log("total", total)
        // console.log("result", result)
        // console.log("resultSize", resultSize)
        // console.log("PAGE_SIZE", PAGE_SIZE)
        // console.log("currentPageInfo", currentPageInfo)
        return currentPageInfo
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}