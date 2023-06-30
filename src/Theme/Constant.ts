import {Platform} from 'react-native'
import {EventEmitter} from 'fbemitter'

// common variable
export const emitter = new EventEmitter()

// common event listner
const eventListenerKeys = {
  updateToken: 'UPDATE_TOKEN',
  logOut: 'LOG_OUT'
}

const token = ''
const refresh = ''
const BROKERDATA: null | any = null

const productSkus: any = Platform.select({
  ios: {skus: ['com.reeva.pro', 'com.reeva.plus']},
  android: [],
  default: []
})

const Plans = {
  Free: 'Free',
  Plus: 'Plus',
  Pro: 'Pro'
}

const productData = [
  {
    id: 'com.reeva.pro',
    amount: '14.99',
    product: 'pro'
  },
  {
    id: 'com.reeva.plus',
    amount: '8.99',
    product: 'plus'
  }
]

const isIOS = Platform.OS === 'ios'
const isAndroid = Platform.OS === 'android'
const isDebug = __DEV__

export default {
  eventListenerKeys,
  token,
  refresh,
  productSkus,
  BROKERDATA,
  Plans,
  productData,
  isIOS,
  isDebug,
  isAndroid
}
