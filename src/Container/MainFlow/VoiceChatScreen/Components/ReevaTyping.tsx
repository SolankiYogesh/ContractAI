import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text} from 'react-native'

import {Colors} from '../../../../Theme'
import {moderateScale} from '../../../../Theme/Responsive'

const ReevaTyping = () => {
  const [dots, setDots] = useState('')
  const typingAnimation = useRef<number>()

  useEffect(() => {
    typingAnimation.current = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return ''
        }
        return prevDots + '.'
      })
    }, 500)

    return () => {
      if (typingAnimation.current) {
        clearInterval(typingAnimation.current)
      }
    }
  }, [])

  return <Text style={styles.animatedTextStyle}>{'Reeva is typing' + dots}</Text>
}

export default ReevaTyping
const styles = StyleSheet.create({
  animatedTextStyle: {
    fontSize: moderateScale(15),
    color: Colors.blackShade2A30,
    textAlign: 'left',
    fontWeight: 'normal'
  }
})
// const styles = StyleSheet.create}`)
