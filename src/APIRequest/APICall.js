import axios from 'axios'
import ApiConfig from '../Config/ApiConfig'
import {getAsyncData, setAsyncData} from '../Functions/CommonFunctions'
import {Constant} from '../Theme'
import EndPoints from './EndPoints'

const axiosInstance = axios.create({
  baseURL: ApiConfig.baseURL,
  timeout: ApiConfig.timeOut,
  withCredentials: false
})

let payloadPrevData = null

axiosInstance.interceptors.response.use(
  (config) => config,
  async (error) => {
    return Promise.reject(error)
  }
)

const logoutUser = async () => {
  commonConstant.emitter.emit(eventListenerKeys.logoutListener, null)
}

const APICall = async (method, body, url = null, header = null) => {
  if (url !== EndPoints.refreshToken) {
    payloadPrevData = {method, body, url}
  }
  method = method || 'post'
  const apiMethod = method.toLowerCase()
  const config = {
    method: apiMethod
  }
  if (url) {
    config.url = url
  }

  if ((apiMethod === 'delete' || apiMethod === 'get') && body) {
    config.params = body
  } else {
    config.data = body
  }
  const token = await getAsyncData(asyncStorageKeys.userToken)
  if (token !== null && token !== undefined) {
    ApiConfig.headers.Authorization = `Bearer ${header || token}`
  }
  config.headers = ApiConfig.headers
  return new Promise((resolve, reject) => {
    axiosInstance(config)
      .then((res) => {
        // debugLog('response', res);
        resolve(res)
      })
      .catch(async (error) => {
        if (error?.response?.status === 401) {
          //   if (url === EndPoints.refreshToken) {
          //     logoutUser();
          //   } else {
          //     const userData = await getAsyncData(asyncStorageKeys.userData);
          //     const newToken = await getRefreshToken(userData);
          //     setAsyncData(Constant.asyncStorageKeys.userToken, token);
          //     if (payloadPrevData) {
          //       const {method, body, url} = payloadPrevData;
          //       const preResponse = await APICall(method, body, url, newToken);
          //       resolve(preResponse);
          //       payloadPrevData = null;
          //     }
          //   }
        }
        // debugLog('error', error);
        else if (error.response) {
          resolve(error.response)
        } else {
          reject(error)
        }
      })
  })
}

// const APICallFormData = async (method = 'post', body, url = null) => {
//     const apiMethod = method.toLowerCase();
//     const config = {
//         method: apiMethod,
//     };
//     if (url) {
//         config.url = url;
//     }

//     if ((apiMethod === 'delete' || apiMethod === 'get') && body) {
//         config.params = body;
//     } else {
//         config.data = body;
//     }
//     const token = await getAsyncData(asyncStorageKeys.userToken);
//     if (token !== null && token !== undefined) {
//         ApiConfig.headersFormDAta.Authorization = `Bearer ${token}`;
//     }
//     config.headers = ApiConfig.headersFormDAta;

//     -.log('config.headers=============', config.headers);

//     return new Promise((resolve, reject) => {
//         axiosInstance(config)
//             .then(res => {
//                 // debugLog('response', res);
//                 resolve(res);
//             })
//             .catch(error => {
//                 // debugLog('error', error);
//                 if (error.response) {
//                     resolve(error.response);
//                 }
//                 reject(error);
//             });
//     });
// };

// const getRefreshToken = userData => {
//   return new Promise(resolve => {
//     const payload = {
//       refresh: userData?.refresh_token,
//     };

//     APICall('post', payload, EndPoints.refreshToken)
//       .then(resp => {
//         if (resp?.data?.access) {
//           const userRes = commonConstant.appUser;
//           userRes.access_token = resp.data.access;
//           setAsyncData(Constant.asyncStorageKeys.userData, userRes);
//           setAsyncData(Constant.asyncStorageKeys.userToken, resp.data.access);
//         }
//         resolve(resp?.data?.access || '');
//       })
//       .catch(() => {
//         resolve('');
//       });
//   });
// };

export default APICall
