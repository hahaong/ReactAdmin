import myAxios from "./myAxios";
import {BASE_URL} from "../config"

export const reqLogin = (username,password) => myAxios.post(`${BASE_URL}/login`, {username,password})
