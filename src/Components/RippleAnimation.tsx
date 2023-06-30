import React, {memo} from 'react'
import {StyleSheet} from 'react-native'
import {useSelector} from 'react-redux'
import Lottie from 'lottie-react-native'
import styled from 'styled-components/native'

import {Images} from '../Theme'
import {moderateScale, verticalScale} from '../Theme/Responsive'
import AppProfileIcon from './AppProfileIcon'

interface RippleAnimationProps {
  isAnimating?: boolean
  imageUrl?: string
  isTop?: boolean
  color?: string
  size: number
  isReeva?: boolean
}

const RippleAnimation = (props: RippleAnimationProps) => {
  const {isAnimating = false, isTop = false, size, isReeva = false} = props
  const user = useSelector((state: any) => state?.user?.userData)

  return (
    <Container size={size} isTop={isTop}>
      <AppProfileIcon
        isImageLocal={isReeva}
        url={isReeva ? Images.Reeva : user?.profile_image}
        size={size * 0.8}
        borderRadius={1000}
        borderWidth={0}
        style={styles.imageStyle}
      />
      {isAnimating && (
        <Lottie
          style={[
            styles.lottieStyle,
            {
              width: size * 1.3,
              height: size * 1.3
            }
          ]}
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
export default memo(RippleAnimation)

const styles = StyleSheet.create({
  lottieStyle: {
    position: 'absolute'
  },
  imageStyle: {
    zIndex: 1000
  }
})

const Container = styled.View`
  width: ${(props: any) => props?.size || 80}px;
  height: ${(props: any) => props?.size || 80}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(p: any) => (p?.isTop ? 0 : verticalScale(100))}px;
  align-self: center;
  overflow: hidden;
  border-radius: ${moderateScale(300)}px;
`
