

import myAxios from "./myAxios";
import { getDocuments, addDocument, searchDocument, checkDuplication, updateDocument,deleteDocument } from './myFirebase';
import { BASE_URL, db } from "../config"

export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, { username, password })

export const reqCategoryList = () => {
    return getDocuments(db, 'category')
}

export const reqSearchCategoryList = (target, data) => {
    return searchDocument(db, 'category', target, data)
}

export const reqCheckDuplicationCategoryList = (target, data) => {
    return checkDuplication(db, 'category', target, data)
}

export const reqAddCategory = (data) => {
    return addDocument(db, 'category', data)
}


export const reqUpdateCategory = (id, target, data ) => {
    return updateDocument(db, 'category', id, target, data)
}

export const reqDeleteCategory = (id) => {
    return deleteDocument(db, 'category', id)
}
