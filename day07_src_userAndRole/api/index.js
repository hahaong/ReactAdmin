

import {
    serverTimestamp,
} from "firebase/firestore/lite";

import myAxios from "./myAxios";
import { getDocuments, addDocument, searchDocument, searchDocumentById, checkDuplication, updateDocument,deleteDocument,pagination,scrollPagination,searchDocumentWithinDate,searchDocumentAdvance} from './myFirebase';
import { BASE_URL} from "../config"

export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, { username, password })

export const reqCategoryList = () => {
    return getDocuments('category')
}

export const reqRoleList = () => {
    return getDocuments('role')
}

export const reqUserList = () => {
    return getDocuments('user')
}

//combine the 2 into one
export const reqPersonList = (currentPageNum) => {
    return pagination('registration','createdAt',currentPageNum)
}

export const reqSearchPersonList = (currentPageNum,searchType,keyword) => {
    return pagination('registration','createdAt',currentPageNum,searchType,keyword)
}


export const reqSearchCategoryList = (target, data) => {
    return searchDocument('category', target, data)
}

export const reqCheckDuplicationCategoryList = (data) => {
    return checkDuplication('category', 'category', data)
}

export const reqAddCategory = (data) => {
    return addDocument('category', data)
}

export const reqUpdateCategory = (id, data ) => {
    return updateDocument('category', id, data)
}

export const reqUpdateUser = (id, data ) => {
    return updateDocument('user', id, data)
}


export const reqAddUser = (data) => {
    return addDocument('user', data)
}


export const reqDeleteCategory = (id) => {
    return deleteDocument('category', id)
}

export const reqDeleteRole = (id) => {
    return deleteDocument('role', id)
}

export const reqDeleteUser = (id) => {
    return deleteDocument('user', id)
}

export const reqPersonById = (id) => {
    return searchDocumentById('registration',id)
}

export const reqRoleById = (id) => {
    return searchDocumentById('role',id)
}


export const reqSearchPerson = (searchData) => {
    return searchDocumentAdvance({col:"registration",searchData})
    // return searchDocumentById('registration',id)
}

export const reqCategoryById = (id) => {
    return searchDocumentById('category',id)
}

export const reqAddPerson = (data) => {
    return addDocument('registration',data)
}

export const reqAddRole = (data) => {
    return addDocument('role',data)
}

export const reqUpdatePerson = (id,data) => {
    return updateDocument('registration',id,data)
}

export const reqUpdateRole = (id,data) => {
    return updateDocument('role',id,{...data, authAt:serverTimestamp()})
}

export const reqDeletePerson = (id) => {
    return deleteDocument('registration', id)
}

export const reqCarparkList = ({currentPageNumber,pageSize,basicOrAdvanceSearch,searchCarParkData}) => {
    return scrollPagination({
        col:"carpark",
        orderTarget:"createdAt",
        currentPageNumber,
        basicOrAdvanceSearch,
        pageSize,
        searchData:searchCarParkData,
        
    })
}

export const reqCarparkListWithinDate = (currentPageNumber,pageSize, advanceSearchData,basicOrAdvanceSearch) => {
    return scrollPagination({
        col:"carpark",
        target:"createdAt",
        currentPageNumber,
        basicOrAdvanceSearch,
        pageSize,
        advanceSearchData
        

    })


    // return searchDocumentWithinDate('carpark','createdAt',date1,date2)
}