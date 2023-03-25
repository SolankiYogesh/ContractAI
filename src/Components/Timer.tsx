/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-bitwise */
import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {StyleProp, TextStyle, ViewStyle} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

import {AlreadyAccountText} from '../CommonStyle/AuthContainer'
import Utility from '../Theme/Utility'

export interface ICountdownRef {
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
}

export interface CountDownProps {
  initialSeconds?: number
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  fontFamily?: string
  autoStart?: boolean
  formatTime?: 'ss' | 'hh:mm:ss'
  onTimes?: (seconds: number) => void
  onPause?: (seconds: number) => void
  onEnd?: (seconds: number) => void
}
const defaultProps = {
  style: {},
  textStyle: {},
  onTimes: (_seconds: number) => {},
  onPause: (_seconds: number) => {},
  onEnd: (_seconds: number) => {}
}

const Timer = React.forwardRef<any, CountDownProps>((props, ref) => {
  const {
    initialSeconds = 0,

    textStyle,
    fontFamily,
    autoStart = false,
    formatTime,
    onEnd,
    onTimes,
    onPause
  } = props

  const interval = useRef(0)
  const hours = useRef(0)
  const minute = useRef(0)
  const seconds = useRef(0)
  const currentSeconds = useRef(0)

  const [key, setKey] = useState(Math.random())

  useImperativeHandle(ref, () => {
    return {start, pause, resume, stop}
  })

  const init = useCallback(() => {
    if (initialSeconds) {
      currentSeconds.current = initialSeconds
      hours.current = ~~(currentSeconds.current / 3600)
      minute.current = ~~((currentSeconds.current % 3600) / 60)
      seconds.current = ~~currentSeconds.current % 60
    }
    setKey(Math.random())
  }, [initialSeconds])

  const start = useCallback(() => {
    init()

    if (!interval.current) {
      timer()
    }
  }, [])

  const pause = useCallback(() => {
    clear()
    if (onPause) {
      onPause(currentSeconds.current)
    }
  }, [])

  const resume = () => {
    if (!interval.current) {
      timer()
    }
  }

  const stop = () => {
    if (onEnd) {
      onEnd(currentSeconds.current)
    }

    init()
    setKey(Math.random())
    clear()
  }

  const clear = () => {
    if (interval.current) {
      BackgroundTimer.clearInterval(interval.current)
      interval.current = 0
    }
  }

  useEffect(() => {
    init()
  }, [initialSeconds])

  useEffect(() => {
    return () => {
      pause()
    }
  }, [])

  useEffect(() => {
    if (autoStart) {
      start()
    }
  }, [autoStart])

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily
      }
    } else {
      return {}
    }
  }

  const timer = useCallback(() => {
    interval.current = BackgroundTimer.setInterval(() => {
      if (currentSeconds.current > 0) {
        currentSeconds.current = currentSeconds.current - 1
        hours.current = ~~(currentSeconds.current / 3600)
        minute.current = ~~((currentSeconds.current % 3600) / 60)
        seconds.current = ~~currentSeconds.current % 60

        if (onTimes) {
          onTimes(currentSeconds.current)
        }
      }
      if (currentSeconds.current <= 0) {
        if (onEnd) {
          onEnd(currentSeconds.current)
        }
        clear()
      }
      setKey(Math.random())
    }, 1000)
  }, [])

  const renderTimer = () => {
    if (formatTime === 'hh:mm:ss') {
      if (hours.current > 0) {
        return (
          <AlreadyAccountText key={key} style={[textStyle, font()]}>{`${hours.current}:${
            minute.current.toString().length === 1 ? '0' : ''
          }${minute.current}:${seconds.current.toString().length === 1 ? '0' : ''}${
            seconds.current
          }`}</AlreadyAccountText>
        )
      } else {
        if (minute.current > 0) {
          return (
            <AlreadyAccountText key={key} style={[textStyle, font()]}>{`${minute.current}:${
              seconds.current.toString().length === 1 ? '0' : ''
            }${seconds.current}`}</AlreadyAccountText>
          )
        } else {
          return (
            <AlreadyAccountText
              key={key}
              style={[textStyle, font()]}
            >{`${seconds.current}`}</AlreadyAccountText>
          )
        }
      }
    } else if (formatTime === 'ss') {
      return (
        <AlreadyAccountText
          key={key}
          style={[textStyle, font()]}
        >{`${currentSeconds.current}`}</AlreadyAccountText>
      )
    } else {
      return (
        <AlreadyAccountText key={key} isClickable style={[textStyle, font()]}>
          {Utility.secondsToMMSS(currentSeconds.current)}
        </AlreadyAccountText>
      )
    }
  }

  return renderTimer()
})

Timer.defaultProps = defaultProps

export default Timer
