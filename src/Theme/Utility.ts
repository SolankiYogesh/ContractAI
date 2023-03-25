import Toast from 'react-native-root-toast'
import _ from 'lodash'

import Colors from './Colors'
import {moderateScale} from './Responsive'

const deepClone = (val: any) => {
  return _.cloneDeep(val)
}

const isValid = (value: string) => {
  const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
  return !value.trim() || !reg.test(value.trim())
}

const secondsToMMSS = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19)
}

const showToast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    textStyle: {fontSize: moderateScale(15)},
    backgroundColor: Colors.black,
    textColor: Colors.white
  })
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
    },
    {
      text: 'Good morning! Are you in the market for a new home or looking to sell your current property?',
      audio: 'https://reactuiregister.000webhostapp.com/5.mp3'
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
  return value && _.trim(value)
}

const Utility = {
  deepClone,
  isValid,
  secondsToMMSS,
  showToast,
  getTimeString,
  getRandomSentenceWithDelay,
  navigationOptions,
  isEmpty
}

export default Utility
