import { SET_USER_INFO } from '../Types';

type userReducer = {
    userInfo: { [key: string]: any }
}

const initialState: userReducer = {
    userInfo: {}
}

export default function userInfoReducer(state = initialState, action: { [key: string]: any }) {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            }
        default: return state;
    }
}

