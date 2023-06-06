import React from 'react'
import {Image, ImageSourcePropType, ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native'
import styled from 'styled-components/native'

import {Colors, Images} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'

interface SettingButtonProps {
  title?: string
  image?: ImageSourcePropType
  isArrow?: boolean
  onPress?: () => void
  color?: string
  isMarginLeft?: boolean
  titleStyle?: StyleProp<TextStyle>
  fontSize?: number
  isMargin?: boolean
  marginVertical?: number
  imageStyle?: StyleProp<ImageStyle>
  style?: StyleProp<ViewStyle>
}

const SettingButton = (props: SettingButtonProps) => {
  const {
    title,
    image,
    isArrow = false,
    onPress = () => {},
    color = '',
    isMarginLeft = true,
    titleStyle = {},
    fontSize = 14,
    isMargin = false,
    marginVertical,
    imageStyle = {},
    style = {}
  } = props
  return (
    <SettingContainer
      marginVertical={marginVertical}
      style={style}
      onPress={onPress}
      isMarginLeft={isMarginLeft}
    >
      {image && <ButtonImage source={image} />}
      <ButtonText isMargin={isMargin} fontSize={fontSize} style={titleStyle} color={color}>
        {title}
      </ButtonText>
      {isArrow && <Image style={imageStyle} source={Images.right_arrow} />}
    </SettingContainer>
  )
}

export default SettingButton

const SettingContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: ${(props: any) => (props?.isMarginLeft ? scale(20) : 0)}px;
  margin-right: ${(props: any) => (props?.isMarginLeft ? scale(20) : 0)}px;
  margin-top: ${(props: any) => verticalScale(props?.marginVertical || 10)}px;
  margin-bottom: ${(props: any) => verticalScale(props?.marginVertical ? 10 : 10)}px;
`
const ButtonText = styled.Text`
  margin-left: ${(props: any) => (!props?.isMargin ? scale(16) : scale(10))}px;
  font-family: ${Fonts.ThemeRegular};
  font-size: ${(props: any) => moderateScale(props?.fontSize)}px;
  flex: 1;
  color: ${(props: any) => props?.color || Colors.blackShade236};
`
const ButtonImage = styled.Image`
  tint-color: ${Colors.blackShade236};
`
