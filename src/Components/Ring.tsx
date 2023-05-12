import React, {useEffect} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from 'react-native-reanimated'

import {moderateScale, verticalScale} from '../Theme/Responsive'

const Ring = ({index, color, isReverce = true}: any) => {
  const opacityValue = useSharedValue(1)
  const scaleValue = useSharedValue(1)

  useEffect(() => {
    opacityValue.value = withRepeat(
      withDelay(
        200 * index,
        withTiming(0, {
          duration: 1500,
          easing: Easing.out(Easing.ease)
        })
      ),
      -1,
      false
    ) // Set initial value to 0.7 instead of 0
    scaleValue.value = withRepeat(
      withDelay(
        200 * index,
        withTiming(2.5, {
          duration: 1500,
          easing: Easing.out(Easing.ease)
        })
      ),
      -1,
      false
    ) // Set initial value to 1 instead of 4
  }, [index, opacityValue, scaleValue, isReverce])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
      transform: [
        {
          scale: scaleValue.value
        }
      ],
      backgroundColor: color
    }
  }, [])

  return <Animated.View style={[styles.ring, animatedStyle]} />
}

export default Ring

const styles = StyleSheet.create({
  ring: {
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: moderateScale(50),
    position: 'absolute'
  }
})
