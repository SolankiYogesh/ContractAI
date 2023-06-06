import React, {memo, useMemo} from 'react'
import {Image} from 'react-native'
import {useSelector} from 'react-redux'
import {CachedImage} from '@georstat/react-native-image-cache'
import Lottie from 'lottie-react-native'
import styled from 'styled-components/native'

import {Images} from '../Theme'
import {moderateScale, verticalScale} from '../Theme/Responsive'

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
  const ImageComponent = useMemo(() => (!isReeva ? CachedImage : Image), [isReeva])

  const imageStyle: any = useMemo(() => {
    return {
      width: '80%',
      height: '80%',
      borderRadius: moderateScale(300),
      zIndex: 1000
    }
  }, [])

  return (
    <Container size={size} isTop={isTop}>
      <ImageComponent
        style={imageStyle}
        resizeMode={'cover'}
        borderRadius={moderateScale(300)}
        source={isReeva ? Images.Reeva : user?.profile_image}
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
export default memo(RippleAnimation)

const Container = styled.View`
  width: ${(props: any) => props?.size || 80}px;
  height: ${(props: any) => props?.size || 80}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(p: any) => (p?.isTop ? 0 : verticalScale(100))}px;
  align-self: center;
  overflow: hidden;
`
