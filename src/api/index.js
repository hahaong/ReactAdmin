

import myAxios from "./myAxios";
import { getDocuments, addDocument, searchDocument, checkDuplication, updateDocument,deleteDocument,pagination } from './myFirebase';
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
    return updateDocument('category', id, 'type' , data)
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