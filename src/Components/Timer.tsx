import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {StyleProp, TextStyle, ViewStyle} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'

import {verticalScale} from '../Theme/Responsive'
import Utility from '../Theme/Utility'
import TouchText from './TouchText'

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
  const {initialSeconds = 0, textStyle, autoStart = false, onEnd, onTimes, onPause} = props

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
  }, [onEnd, onTimes])

  const start = useCallback(() => {
    init()

    if (!interval.current) {
      timer()
    }
  }, [init, timer])

  const pause = useCallback(() => {
    clear()
    if (onPause) {
      onPause(currentSeconds.current)
    }
  }, [onPause])

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
  }, [init, initialSeconds])

  useEffect(() => {
    return () => {
      pause()
    }
  }, [pause])

  useEffect(() => {
    if (autoStart) {
      start()
    }
  }, [autoStart, start])

  return (
    <TouchText
      marginTop={verticalScale(30)}
      marginBottom={verticalScale(30)}
      key={key}
      style={textStyle}
      text={Utility.secondsToMMSS(currentSeconds.current)}
    />
  )
})

Timer.defaultProps = defaultProps

export default Timer
