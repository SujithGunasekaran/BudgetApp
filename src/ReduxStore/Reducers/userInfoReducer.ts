import { SET_USER_NAME } from '../Types';

type userReducer = {
    userName: String | null
}

const initialState: userReducer = {
    userName: null
}

export default function userInfoReducer(state = initialState, action: { [key: string]: any }) {
    switch (action.type) {
        case SET_USER_NAME:
            return {
                ...state,
                userName: action.userName
            }
        default: return state;
    }
}

