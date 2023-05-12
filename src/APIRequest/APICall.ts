/* eslint-disable no-console */
import Axios from 'axios'

import Constant, {emitter} from '../Theme/Constant'
import Utility from '../Theme/Utility'
import AppConfig from './AppConfig'
import EndPoints from './EndPoints'

type methodtype = 'post' | 'get' | 'put' | 'delete'

export const getHeaders = (isFormdata = false) => {
  return {
    accept: 'application/json',
    'Content-Type': isFormdata ? 'multipart/form-data' : 'application/json',
    'X-CSRFTOKEN': 'X-CSRFTOKEN: BFQcYOCNH7nZCRRbhEg8MzRWpLg6O1ThL0fiW6mbzSfs78qQExca0UrnBoXRyl1M'
  }
}
const axiosInstance = Axios.create({
  baseURL: AppConfig.API_URL
})

let payloadPrevData: any = null
axiosInstance.interceptors.request.use(
  (config: any) => {
    if (Constant?.token && typeof Constant?.token === 'string') {
      config.headers = {Authorization: 'Bearer ' + Constant?.token || ' '}
    }
    return config
  },
  (error) => {
    console.log('axios request error =>', error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (config) => {
    console.log('axios response =>', config)
    return config
  },
  (error) => {
    console.log('axios response error =>', error.response || error)
    return Promise.reject(error)
  }
)

const getFormData = (object: any) => {
  const formData = new FormData()
  Object.keys(object).forEach((key) => formData.append(key, object[key]))
  return formData
}

const APICall = async (
  method: methodtype = 'post',
  body: any,
  url = '',
  headers = {},
  formData = false
) => {
  if (url !== EndPoints.refresh) {
    payloadPrevData = {method, body, url}
  }
  const config: any = {
    method: method.toString(),
    timeout: 1000 * 60 * 2
  }
  if (url) {
    config.url = url
  }
  if (body && method === 'get') {
    config.params = body
  } else if (body && (method === 'post' || method === 'put') && formData) {
    config.data = getFormData(body)
  } else {
    config.data = body
  }

  config.headers = getHeaders(formData)
  if (headers && typeof headers === 'string') {
    config.headers = {Authorization: 'Bearer ' + headers || ' '}
  }

  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res) => resolve({status: res.status, data: res.data}))
      .catch(async (error) => {
        if (error?.response?.status === 401) {
          const tokenData: any = await getRefreshToken()

          if (payloadPrevData && tokenData?.token) {
            const {method, body, url} = payloadPrevData
            const preResponse = await APICall(method, body, url, tokenData?.token, formData)
            emitter.emit(Constant.eventListenerKeys.updateToken, tokenData)
            resolve(preResponse)
            payloadPrevData = null
          }
        } else {
          resolve(error?.response)
        }
      })
  })
}

const getRefreshToken = () => {
  return new Promise((resolve) => {
    const payload = {
      refresh: Constant.refresh
    }

    APICall('post', payload, EndPoints.refresh)
      .then((resp: any) => {
        if (resp?.status === 200 && resp?.data) {
          Constant.token = resp?.data?.token || ''
          Constant.refresh = resp?.data?.refresh_token || ''
          resolve(resp?.data || '')
        } else {
          Utility.showAlert('Session Expired!')
          emitter.emit(Constant.eventListenerKeys.logOut)
        }
      })
      .catch(() => {
        resolve('')
        Utility.showAlert('Session Expired!')
        emitter.emit(Constant.eventListenerKeys.logOut)
      })
  })
}

export default APICall
