import {Alert} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import Voice from '@react-native-voice/voice'
import _ from 'lodash'

import {AudioFiles} from '../types/Types'

const deepClone = (val: any) => {
  return _.cloneDeep(val)
}

const wait = (seconds = 1000): Promise<void> => {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, seconds)
  })
}

const isInternet = () => {
  return new Promise<boolean>(async (resolve) => {
    try {
      const response = await NetInfo.fetch()
      if (response.isConnected) {
        resolve(true)
      } else {
        Utility.showAlert('No Internet Connection')
        resolve(false)
      }
    } catch (error) {
      Utility.showAlert('No Internet Connection')
      resolve(false)
    }
  })
}

const isValid = (value: string) => {
  const reg = /\S+@\S+\.\S+/
  return !value.trim() || !reg.test(value.trim())
}

const validatePassword = (password: string) => {
  return password !== '' && password.length >= 5
}

const secondsToMMSS = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19)
}

const getTimeString = () => {
  const currentDate = new Date()
  // Get the current hour
  const currentHour = currentDate.getHours()
  // Determine the time of day based on the current hour
  let timeOfDay

  if (currentHour >= 0 && currentHour < 12) {
    timeOfDay = 'Morning'
  } else if (currentHour >= 12 && currentHour < 18) {
    timeOfDay = 'Afternoon'
  } else if (currentHour >= 18 && currentHour < 24) {
    timeOfDay = 'Evening'
  }

  return timeOfDay
}

const navigationOptions = {
  headerShown: false
}

const isEmpty = (value: string) => {
  return Boolean(value && _.trim(value))
}

const googleLogin = () => {
  return new Promise(async (resolve) => {
    try {
      await GoogleSignin.hasPlayServices()
      GoogleSignin.signIn()
        .then(async (data) => {
          const token = await GoogleSignin.getTokens()
          resolve({
            ...data,
            token
          })
        })
        .catch((e) => {
          resolve(false)
        })
    } catch (error) {}
  })
}

const showAlert = (message = '') => {
  if (message) {
    Alert.alert(
      'Reeva',
      message,
      [
        {
          text: 'OK',
          style: 'cancel'
        }
      ],
      {userInterfaceStyle: 'light'}
    )
  }
}

const formateNumber = (number: string) => {
  if (typeof number === 'string' && isEmpty(number)) {
    return number
      .replace(/\D/g, '')
      .replace(/(\d*)(\d{3})(\d{3})(\d{4})$/, (s, a, b, c, d) => `+${a} (${b}) ${c}-${d}`)
      .replace(/\+(1\b|\s)\s*/, '')
  } else {
    return ''
  }
}

const formatPhoneNumber = (text: string, previousText: string | any[]) => {
  if (!text) return text

  const deleting = previousText && previousText.length > text.length
  if (deleting) {
    return text
  }

  const cleaned = text.replace(/\D/g, '') // remove non-digit characters
  let match = null

  if (cleaned.length > 0 && cleaned.length < 2) {
    return `(${cleaned}`
  } else if (cleaned.length === 3) {
    return `(${cleaned}) `
  } else if (cleaned.length > 3 && cleaned.length < 5) {
    match = cleaned.match(/(\d{3})(\d{1,3})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}`
    }
  } else if (cleaned.length === 6) {
    match = cleaned.match(/(\d{3})(\d{3})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-`
    }
  } else if (cleaned.length > 6) {
    match = cleaned.match(/(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  }

  return text
}

const hideEmail = (email: string) => {
  return email.replace(/(.{1})(.*)(?=@)/, function (gp1: string, gp2: string, gp3: string) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*'
    }
    return gp2
  })
}

const convert = (text: string) => {
  const words = text.split(' ')
  let firstTwoChars = ''
  const filteredWords = words.filter((word: string) => isNaN(Number(word)))

  if (filteredWords.length > 1) {
    const firstLetter = filteredWords[0].match(/[a-zA-Z]/)
    const secondLetter = filteredWords[1].match(/[a-zA-Z]/)
    if (firstLetter && secondLetter) {
      firstTwoChars = firstLetter[0].toUpperCase() + secondLetter[0].toUpperCase()
    } else if (firstLetter) {
      firstTwoChars = firstLetter[0].toUpperCase()
    } else if (secondLetter) {
      firstTwoChars = secondLetter[0].toUpperCase()
    }
  } else {
    const firstTwoLetters = text.match(/[a-zA-Z]{2}/)
    if (firstTwoLetters) {
      firstTwoChars = firstTwoLetters[0].toUpperCase()
    }
  }

  return firstTwoChars || '#'
}

const destroyVoice = () => {
  try {
    Voice.destroy()
  } catch (error) {
    //
  }
}

const extractBracketWords = (str: string) => {
  return str.match(/(\[[^\]]+\])/g)
}

const getAudioFile = (key: string) => {
  const files: AudioFiles = {
    1: require('../Resources/Audio/1.mp3'),
    2: require('../Resources/Audio/2.mp3'),
    3: require('../Resources/Audio/3.mp3'),
    4: require('../Resources/Audio/4.mp3'),
    5: require('../Resources/Audio/5.mp3'),
    6: require('../Resources/Audio/6.mp3'),
    7: require('../Resources/Audio/7.mp3'),
    9: require('../Resources/Audio/9.mp3'),
    10: require('../Resources/Audio/10.mp3'),
    11: require('../Resources/Audio/11.mp3'),
    12: require('../Resources/Audio/12.mp3'),
    13: require('../Resources/Audio/13.mp3'),
    14: require('../Resources/Audio/14.mp3'),
    15: require('../Resources/Audio/15.mp3'),
    16: require('../Resources/Audio/16.mp3'),
    17: require('../Resources/Audio/17.mp3'),
    18: require('../Resources/Audio/18.mp3'),
    19: require('../Resources/Audio/19.mp3'),
    20: require('../Resources/Audio/20.mp3'),
    21: require('../Resources/Audio/21.mp3'),
    22: require('../Resources/Audio/22.mp3'),
    23: require('../Resources/Audio/23.mp3'),
    24: require('../Resources/Audio/24.mp3'),
    25: require('../Resources/Audio/25.mp3'),
    26: require('../Resources/Audio/26.mp3'),
    27: require('../Resources/Audio/27.mp3'),
    28: require('../Resources/Audio/28.mp3'),
    29: require('../Resources/Audio/29.mp3'),
    30: require('../Resources/Audio/30.mp3'),
    31: require('../Resources/Audio/31.mp3'),
    32: require('../Resources/Audio/32.mp3'),
    33: require('../Resources/Audio/33.mp3'),
    34: require('../Resources/Audio/34.mp3')
  }

  return files[Number(key)]
}

const Utility = {
  deepClone,
  isValid,
  validatePassword,
  secondsToMMSS,
  getTimeString,
  getAudioFile,
  navigationOptions,
  isEmpty,
  googleLogin,
  showAlert,
  formateNumber,
  formatPhoneNumber,
  hideEmail,
  convert,
  destroyVoice,
  isInternet,
  extractBracketWords,
  wait
}

export default Utility
