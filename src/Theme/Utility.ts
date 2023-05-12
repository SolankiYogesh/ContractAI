import {Alert} from 'react-native'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import Voice from '@react-native-voice/voice'
import _ from 'lodash'

const deepClone = (val: any) => {
  return _.cloneDeep(val)
}

const isValid = (value: string) => {
  const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
  return !value.trim() || !reg.test(value.trim())
}

const validatePassword = (password: string) => {
  return password !== '' && password.length >= 5
}

const secondsToMMSS = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19)
}

export const getRandomSentenceWithDelay = () => {
  const sentences = [
    {
      text: 'Hi there! Are you interested in buying or selling a property?',
      audio: 'https://reactuiregister.000webhostapp.com/1.mp3'
    },
    {
      text: 'Good afternoon! How may I assist you with your real estate needs?',
      audio: 'https://reactuiregister.000webhostapp.com/2.mp3'
    },
    {
      text: 'Hello and welcome! How can I help you find your dream home today?',
      audio: 'https://reactuiregister.000webhostapp.com/3.mp3'
    },
    {
      text: "Hi, I'm Reeva. How can I help you with your property search?",
      audio: 'https://reactuiregister.000webhostapp.com/4.mp3'
    }
  ]

  const randomIndex = Math.floor(Math.random() * sentences.length)
  return sentences[randomIndex]
}

const getTimeString = () => {
  const currentDate = new Date()

  // Get the current hour
  const currentHour = currentDate.getHours()

  // Define the times of day
  const MORNING = 'morning'
  const AFTERNOON = 'afternoon'
  const EVENING = 'evening'
  const NIGHT = 'night'

  // Determine the time of day based on the current hour
  let timeOfDay
  if (currentHour >= 5 && currentHour < 12) {
    timeOfDay = MORNING
  } else if (currentHour >= 12 && currentHour < 18) {
    timeOfDay = AFTERNOON
  } else if (currentHour >= 18 && currentHour < 22) {
    timeOfDay = EVENING
  } else {
    timeOfDay = NIGHT
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
    Alert.alert('Reeva', message, undefined, {userInterfaceStyle: 'light'})
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

const removeCode = (value: string) => {
  let mobile = ''
  value = value.replace(/\s/g, '')
  if (value.startsWith('+')) {
    const temp = value.substring(3, value.length)
    mobile = temp
  } else {
    mobile = value
  }
  return mobile
}

const extractBracketWords = (str: string) => {
  return str.match(/(\[[^\]]+\])/g)
}

const Utility = {
  deepClone,
  isValid,
  validatePassword,
  secondsToMMSS,
  getTimeString,
  getRandomSentenceWithDelay,
  navigationOptions,
  isEmpty,
  googleLogin,
  showAlert,
  formateNumber,
  formatPhoneNumber,
  hideEmail,
  convert,
  destroyVoice,
  removeCode,
  extractBracketWords
}

export default Utility
