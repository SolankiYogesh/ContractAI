import AsyncStorage from '@react-native-async-storage/async-storage'
import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {createLogger} from 'redux-logger'
import {persistReducer, persistStore} from 'redux-persist'
import thunk from 'redux-thunk'

import UserSlice from './Reducers/UserSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const rootReducer = combineReducers({
  user: UserSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, createLogger()]
})
export const persistor = persistStore(store)
