import myAxios from "./myAxios";
import {BASE_URL} from "../config"

export const reqLogin = (username,password) => myAxios.post(`${BASE_URL}/login`, {username,password})

export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)
