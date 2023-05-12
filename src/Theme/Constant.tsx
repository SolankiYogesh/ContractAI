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

export default {
  eventListenerKeys,
  token,
  refresh
}
