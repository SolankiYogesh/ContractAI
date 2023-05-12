import React from 'react'
import Lottie from 'lottie-react-native'
import styled from 'styled-components/native'

import {Images} from '../Theme'
import {verticalScale} from '../Theme/Responsive'

interface RippleAnimationProps {
  isAnimating?: boolean
  imageUrl?: string
  isTop?: boolean
  color?: string
  size: number
}

const RippleAnimation = (props: RippleAnimationProps) => {
  const {imageUrl, isAnimating = false, isTop = false, size} = props

  return (
    <Container size={size} isTop={isTop}>
      <ImageContainer
        source={{
          uri: imageUrl
        }}
        resizeMode={'cover'}
      />

      {isAnimating && (
        <Lottie
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: size * 1.3,
            height: size * 1.3,
            position: 'absolute'
          }}
          autoPlay
          source={Images.themeAnimation}
          loop
          autoSize
          speed={1}
        />
      )}
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
  margin-bottom: ${(p: any) => (p?.isTop ? 0 : verticalScale(100))}px;
  align-self: center;
`
