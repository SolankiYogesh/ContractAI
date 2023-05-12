import React, {useCallback} from 'react'
import {ImageSourcePropType, ImageStyle, StyleProp, TouchableOpacity, ViewStyle} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import {Colors, Images} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'
import {moderateScale, verticalScale} from '../Theme/Responsive'

interface BackButtonProps {
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  image?: ImageSourcePropType
  imageStyle?: StyleProp<ImageStyle>
  isHeader?: boolean
  disabled?: boolean
  colors?: string[]
  parentStyle?: StyleProp<ViewStyle>
}

const BackButton = (props: BackButtonProps) => {
  const {
    onPress,
    style = {},
    image,
    imageStyle = {},
    colors = undefined,
    isHeader = false,
    disabled = false,
    parentStyle = {}
  } = props
  const navigation = useNavigation()

  const onPressBack = useCallback(() => {
    if (onPress) {
      onPress()
      return
    }
    navigation.goBack()
  }, [navigation, onPress])

  const tint = {
    tintColor: Colors.ThemeColor
  }

  const containerStyle = {
    width: verticalScale(45),
    height: verticalScale(45),
    ...CommonStyles.centerItem,
    borderRadius: moderateScale(20),
    marginBottom: isHeader ? 0 : verticalScale(30)
  }

  return (
    <TouchableOpacity
      hitSlop={{
        bottom: 20,
        left: 20,
        right: 20,
        top: 20
      }}
      style={parentStyle}
      disabled={disabled}
      onPress={onPressBack}
    >
      <LinearGradient
        colors={colors ?? [Colors.purpleShade8A63, Colors.purpleShadeB090]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={91.48}
        style={[containerStyle, style]}
      >
        <ImageContainer
          style={[tint, imageStyle]}
          source={image ?? Images.left_arrow}
          resizeMode={'contain'}
        />
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default BackButton

const ImageContainer = styled.Image`
  width: 50%;
  height: 50%;
`
