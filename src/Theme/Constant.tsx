/* eslint-disable prettier/prettier */
import {Dimensions} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {EventEmitter} from 'fbemitter'

import ApiConfig from '../Config/ApiConfig'

const {width, height} = Dimensions.get('window')
// common variable
export const commonConstant = {
  scrWidth: width,
  scrHeight: height,
  emitter: new EventEmitter(),
  userToken: null
}
// common event listner
export const eventListenerKeys = {
  Login: 'Login',
  Logout: 'Logout',
  UpdatePage: 'UpdatePage',
  LogoutModelVisibility: 'LogoutModelVisibility',
  ProfileUpdate: 'PofileUdate',
  HomeBookMark: 'HomeBookMark',
  HomeLike: 'HomeLike'
}
// async-storage key
export const asyncStorageKeys = {
  UserData: 'UserData',
  UserId: 'UserId',
  UserToken: 'UserToken',
  languageCode: 'languageCode',
  isLoginDataRemember: 'isLoginDataRemember',
  userLoginData: 'userLoginData',
  categoryList: 'categoryList',
  typeList: 'typeList',
  testMode: 'testMode'
}

// common function store token
export const storeTokenData = async (data = null) => {
  if (data != null) {
    AsyncStorage.setItem('tokenData', JSON.stringify(data))
    return
  }
  const tokenData = await AsyncStorage.getItem('tokenData')
  return tokenData != null ? JSON.parse(tokenData) : null
}
// common function get header for api
export const getHeaderWithAuthToken = () => {
  const newHeaders = {...ApiConfig.headers, Authorization: `Bearer ${commonConstant.userToken}`}
  return newHeaders
}

export default {
  commonConstant,
  eventListenerKeys,
  asyncStorageKeys,
  getHeaderWithAuthToken
}
