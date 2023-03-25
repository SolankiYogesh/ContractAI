import React from 'react'
import {StyleSheet} from 'react-native'
import {Easing} from 'react-native-reanimated'
import _ from 'lodash'
import {MotiView} from 'moti'
import styled from 'styled-components/native'

import Colors from '../Theme/Colors'
import {moderateScale, verticalScale} from '../Theme/Responsive'

interface RippleAnimationProps {
  isAnimating?: boolean
  imageUrl?: string
  isTop?: boolean
  color?: string
  size?: number
}

const RippleAnimation = (props: RippleAnimationProps) => {
  const {imageUrl, isAnimating = false, isTop = false, color = Colors.ThemeColor, size} = props

  const styles = StyleSheet.create({
    styles: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: moderateScale(50),
      backgroundColor: color,
      position: 'absolute'
    }
  })

  return (
    <Container size={size} isTop={isTop}>
      <ImageContainer
        source={{
          uri: imageUrl
        }}
        resizeMode={'cover'}
      />
      {isAnimating &&
        _.map([...Array(10).keys()], (i, index) => {
          return (
            <MotiView
              from={{
                opacity: 0.7,
                scale: 1
              }}
              animate={{
                opacity: 0,
                scale: 4
              }}
              key={index}
              transition={{
                type: 'timing',
                duration: 2000,
                easing: Easing.out(Easing.ease),
                delay: index * 200,
                loop: true,
                repeatReverse: false
              }}
              style={styles.styles}
            />
          )
        })}
    </Container>
  )
}
export default RippleAnimation
const ImageContainer = styled.Image`
  width: 80%;
  height: 80%;
  border-radius: 300px;
  z-index: 1000;
`
const Container = styled.View`
  width: ${(props: any) => props?.size || 80}px;
  height: ${(props: any) => props?.size || 80}px;
  align-items: center;
  justify-content: center;
  margin-top: ${(p: any) => (p?.isTop ? verticalScale(50) : 0)}px;
  margin-bottom: ${(p: any) => (p?.isTop ? 0 : verticalScale(150))}px;
  align-self: center;
`
