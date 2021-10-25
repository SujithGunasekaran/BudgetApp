import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import globalReducer from './Reducers';


// // To store redux in localstorage

// const saveToLocalStorage = (state: { [key: string]: any }) => {
//     try {
//         const serializedData = JSON.stringify(state);
//         localStorage.setItem('state', serializedData);
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

// // getting the state from localstorage

// const getDataFromLocalStorage = () => {
//     try {
//         const localStorageState = localStorage.getItem('state');
//         if (localStorageState === null) return undefined;
//         return JSON.parse(localStorageState);
//     }
//     catch (err) {
//         console.log(err);
//         return undefined;
//     }
// }

// const stateFromLocalStorage = getDataFromLocalStorage();

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    globalReducer,
    // stateFromLocalStorage,
    compose(
        applyMiddleware(thunk),
        composeEnhancers()
    )
);

// store.subscribe(() => saveToLocalStorage(store.getState()));


export default store;
