import { createStore } from "redux"
import { combineReducers } from "redux"
import { collapsedReducer } from "./reducers/collapsedReducer"
import { loadingReducer } from "./reducers/loadingReducer"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web




const reducer = combineReducers({
    collapsedReducer,
    loadingReducer
})

const persistConfig = {
    key: 'zhang',
    storage,
    blacklist:['loadingReducer']
}

const persistReducer_zhang = persistReducer(persistConfig, reducer)

const store = createStore(persistReducer_zhang)
const persistStore_zhang = persistStore(store)

export{
    store,
    persistStore_zhang
}
