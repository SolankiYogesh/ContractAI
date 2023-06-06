import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {StyleSheet, Text} from 'react-native'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'

import {Colors} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, scale} from '../Theme/Responsive'
import Utility from '../Theme/Utility'

const AppToast = forwardRef((props, ref) => {
  const [text, setText] = useState('')

  useImperativeHandle(ref, () => ({
    show(state: string) {
      setText(state)
    }
  }))

  useEffect(() => {
    if (!text) return
    Utility.wait(300).then(() => {
      setText('')
    })
  }, [text])

  return (
    !!text && (
      <Animated.View style={styles.container} exiting={FadeOut.delay(500)} entering={FadeIn}>
        <Text style={styles.toastText}>{text}</Text>
      </Animated.View>
    )
  )
})

export default AppToast

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ThemeColor,
    padding: scale(10),
    zIndex: 1000,
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(20)
  },
  toastText: {
    fontFamily: Fonts.ThemeSemiBold,
    color: Colors.white,
    fontSize: scale(16)
  }
})
