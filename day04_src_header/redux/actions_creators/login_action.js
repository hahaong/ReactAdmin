import { SAVE_USER_INFO,DELETE_USER_INFO } from '../action_types'

export const createSaveUserInfoAction = (value) => {
    localStorage.setItem('user',JSON.stringify(value))
    return{
        type: SAVE_USER_INFO,
        data: value
    }
}


export const createDeleteUserInfoAction = (value) => {
    localStorage.removeItem('user')
    return{
        type: DELETE_USER_INFO,
    }
}
