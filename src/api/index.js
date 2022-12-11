

import myAxios from "./myAxios";
import { getDocuments, addDocument, searchDocument, searchDocumentById, checkDuplication, updateDocument,deleteDocument,pagination } from './myFirebase';
import { BASE_URL} from "../config"

export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, { username, password })

export const reqCategoryList = () => {
    return getDocuments('category')
}

export const reqSearchCategoryList = (target, data) => {
    return searchDocument('category', target, data)
}

export const reqCheckDuplicationCategoryList = (data) => {
    return checkDuplication('category', 'type', data)
}

export const reqAddCategory = (data) => {
    return addDocument('category', data)
}

export const reqUpdateCategory = (id, data ) => {
    return updateDocument('category', id, data)
}

export const reqDeleteCategory = (id) => {
    return deleteDocument('category', id)
}

export const reqPersonList = (currentPageNum) => {
    return pagination('registration','createdAt',currentPageNum)
}

export const reqSearchPersonList = (currentPageNum,searchType,keyword) => {
    return pagination('registration','createdAt',currentPageNum,searchType,keyword)
}

export const reqPersonById = (id) => {
    return searchDocumentById('registration',id)
}

export const reqCategoryById = (id) => {
    return searchDocumentById('category',id)
}

export const reqAddPerson = (data) => {
    return addDocument('registration',data)
}

export const reqUpdatePerson = (id,data) => {
    return updateDocument('registration',id,data)
}

export const reqDeletePerson = (id) => {
    return deleteDocument('registration', id)
}