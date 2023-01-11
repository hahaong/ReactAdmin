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
        let myQuery = query(myCollection, orderBy('createdAt','desc'))
        let result = await getDocs(myQuery)
        if (result.empty) {
            message.warning('The database is empty', 5)
            return new Promise(() => { })
        }
        return result.docs
    } catch (error) {
        console.log(error.message)
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}


export const searchDocumentAdvance = async ({ col, searchData }) => {
    console.log(col)
    console.log(searchData)
    console.log(searchData.length)

    try {
        let myCollection = collection(db, col);
        let myQuery;
        if (searchData.length == 0) {
            throw new Error('Search Data is Empty');
        }
        if (searchData.length == 1) {
            console.log("enter case 1")
            console.log(searchData[0].target)
            console.log(searchData[0].operator)
            console.log(searchData[0].data)
            myQuery = query(myCollection,
                where(searchData[0].target, searchData[0].operator, searchData[0].data))

            console.log(await getDocs(myQuery))
        } else if (searchData.length == 2) {
            myQuery = query(myCollection,
                where(searchData[0].target, searchData[0].operator, searchData[0].data),
                where(searchData[1].target, searchData[1].operator, searchData[1].data))
        } else if (searchData.length == 3) {
            myQuery = query(myCollection,
                where(searchData[0].target, searchData[0].operator, searchData[0].data),
                where(searchData[1].target, searchData[1].operator, searchData[1].data),
                where(searchData[2].target, searchData[2].operator, searchData[2].data))
        }
        console.log(myQuery)

        let result = await getDocs(myQuery)
        console.log(result)
        return result
    } catch (error) {
        message.error(error.message, 5)
        console.error(error.message)
        return new Promise(() => { })
    }
}


//not robust
export const searchDocument = async (col, target, data) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, where(target, "==", data))
        let result = await getDocs(myQuery)
        return result
        // return result.docs  OngLipWei in future will change to this
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}


export const searchDocumentWithinDate = async (col, target, date1, date2) => {
    try {
        let myCollection = collection(db, col);
        let myQuery = query(myCollection, where(target, ">=", date1), where(target, "<=", date2))
        let result = await getDocs(myQuery)
        result.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
        // console.log(result)
        // console.log(result.docs)
        return result
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const searchDocumentById = async (col, id) => {
    try {
        let myDoc = doc(db, col, id);
        // let myDoc = doc(db, col, "UIH7FYsCaepPFCEFt17r");
        let result = await getDoc(myDoc)
        if(!result.exists()){
            message.warning("Data not found",5)
            return new Promise(()=>{})
        }else{
            return result
        }
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
        return {msg:"success"}
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
        return {msg:"success"};
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

//currentPageNum and totalDataCount is important to do number pagination
export const pagination = async (col, target, currentPageNum, orderType = "", keyword = "", pageSize = PAGE_SIZE) => {
    try {
        let requestDataNumber = currentPageNum * pageSize
        let total
        let myQuery
        let result
        let resultSize
        if (keyword == "") { //no need go to search by keyword
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

        else { //search by keyword
            // console.log("myFirebase Search function...")
            total = await getCount(query(collection(db, col), orderBy(orderType), startAt(keyword)))
            total = total.data().count
            myQuery = query(collection(db, col), orderBy(orderType), startAt(keyword), endAt(keyword), limit(requestDataNumber))
            result = await getDocs(myQuery);
            resultSize = result.size
        }

        if (result.empty) {
            message.warning('Data not found, please try again', 5)
            return {
                currentPageData: [],
                currentPageNumber: currentPageNum,
                totalDataCount: 0
            }
            // return new Promise(() => { })
        }

        let currentPageInfo = (resultSize % pageSize == 0) ?
            {
                currentPageData: result.docs.splice(-pageSize),
                currentPageNumber: currentPageNum,
                totalDataCount: total
            } : {
                currentPageData: result.docs.splice(-(resultSize % pageSize)),
                currentPageNumber: currentPageNum,
                totalDataCount: total
            }
        // console.log("target", target)
        // console.log("currentPageNum", currentPageNum)
        // console.log("requestDataNumber", requestDataNumber)
        // console.log("orderType", orderType)
        // console.log("keyword", keyword)
        // console.log("total", total)
        // console.log("result", result)
        // console.log("resultSize", resultSize)
        // console.log("pageSize", pageSize)
        // console.log("currentPageInfo", currentPageInfo)
        return currentPageInfo
    } catch (error) {
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}

export const scrollPagination = async ({ col, orderTarget, currentPageNumber, basicOrAdvanceSearch = "", orderType = "", searchData = [], pageSize = PAGE_SIZE }) => {
    console.log(basicOrAdvanceSearch)
    console.log(searchData)
    console.log(searchData.length ? searchData[0].target : "empty")

    try {
        let requestDataNumber = currentPageNumber * pageSize
        let total
        let myQuery
        let result
        let resultSize


        if (basicOrAdvanceSearch == "basic") {
            total = await getCount(query(collection(db, col)))
            total = total.data().count
            myQuery = query(collection(db, col), orderBy(orderTarget, "desc"), limit(requestDataNumber))
            result = await getDocs(myQuery);
            resultSize = result.size

            console.log("firebase currentPageNumber:", currentPageNumber)
            console.log("firebase pageSize:", pageSize)
            console.log("firebase requestDataNumber:", requestDataNumber)
            console.log("firebase Total:", total)
            console.log("firebase resultSize:", resultSize)

            // result.forEach((item) => {
            //     console.log({
            //         ...item.data(), createdAt: dayjs(item.data().createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss")
            //     })
            // })
        } else if (basicOrAdvanceSearch == "advance") {
            switch (searchData.length) {
                case 1:
                    total = await getCount(query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data)))
                    total = total.data().count

                    myQuery = query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data), orderBy(orderTarget, "desc"), limit(requestDataNumber))
                    break;
                case 2:
                    console.log("in case 2")
                    total = await getCount(query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data)))
                    total = total.data().count

                    myQuery = query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data), orderBy(orderTarget, "desc"), limit(requestDataNumber)
                    )
                    break;
                case 3:
                    console.log("in case 3")
                    console.log(searchData)
                    console.log(searchData[0]['target'])
                    total = await getCount(query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data),
                        where(searchData[2].target, searchData[2].operator, searchData[2].data)))
                    total = total.data().count

                    myQuery = query(collection(db, col),
                        where(searchData[0]['target'], searchData[0]['operator'], searchData[0]['data']),
                        where(searchData[1]['target'], searchData[1]['operator'], searchData[1]['data']),
                        where(searchData[2]['target'], searchData[2]['operator'], searchData[2]['data']), orderBy(orderTarget, "desc"), limit(requestDataNumber)
                    )
                    break;
                case 4:
                    total = await getCount(query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data),
                        where(searchData[2].target, searchData[2].operator, searchData[2].data),
                        where(searchData[3].target, searchData[3].operator, searchData[3].data)
                    ))
                    total = total.data().count

                    myQuery = query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data),
                        where(searchData[2].target, searchData[2].operator, searchData[2].data),
                        where(searchData[3].target, searchData[3].operator, searchData[3].data), orderBy(orderTarget, "desc"), limit(requestDataNumber)
                    )
                    break;
                case 5:
                    total = await getCount(query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data),
                        where(searchData[2].target, searchData[2].operator, searchData[2].data),
                        where(searchData[3].target, searchData[3].operator, searchData[3].data),
                        where(searchData[4].target, searchData[4].operator, searchData[4].data)
                    ))
                    total = total.data().count

                    myQuery = query(collection(db, col),
                        where(searchData[0].target, searchData[0].operator, searchData[0].data),
                        where(searchData[1].target, searchData[1].operator, searchData[1].data),
                        where(searchData[2].target, searchData[2].operator, searchData[2].data),
                        where(searchData[3].target, searchData[3].operator, searchData[3].data),
                        where(searchData[4].target, searchData[4].operator, searchData[4].data), orderBy(orderTarget, "desc"), limit(requestDataNumber)
                    )
                    break;
            }
            result = await getDocs(myQuery);
            resultSize = result.size
        }


        if (result.empty) {
            message.warning('Data not found, please try again', 5)
            return {
                currentPageData: [],
                currentPageNumber,
                totalDataCount: 0,
                isMore: false
            }
            // return new Promise(() => { })
        }

        let currentPageInfo = {
            currentPageData: result.docs,
            currentPageNumber,
            totalDataCount: total,
            isMore: !(resultSize === total)
        }

        console.log(currentPageInfo)
        // console.log("orderTarget", orderTarget)
        // console.log("currentPageNum", currentPageNum)
        // console.log("requestDataNumber", requestDataNumber)
        // console.log("searchType", searchType)
        // console.log("keyword", keyword)
        // console.log("total", total)
        // console.log("result", result)
        // console.log("resultSize", resultSize)
        // console.log("pageSize", pageSize)
        // console.log("currentPageInfo", currentPageInfo)
        return currentPageInfo
    } catch (error) {
        console.error(error.message)
        message.error(error.message, 5)
        return new Promise(() => { })
    }
}