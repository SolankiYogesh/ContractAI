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
  ios: {skus: ['com.reeva.elite']},

  android: [],

  default: []
})

const Plans = {
  Free: 'Free',
  Plus: 'Plus',
  Pro: 'Pro'
}

export default {
  eventListenerKeys,
  token,
  refresh,
  productSkus,
  BROKERDATA,
  Plans
}
