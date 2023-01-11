import { SAVE_PERSON_LIST } from '../action_types'

export const createSavePersonAction = (value) => {
    return {type:SAVE_PERSON_LIST,data:value}
}
