import React from 'react'
import {ImageSourcePropType, StyleProp, TextStyle} from 'react-native'
import styled from 'styled-components/native'

import {Colors, Images} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import {ImageContainer} from '../SettingScreen'

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
    isMargin = false
  } = props
  return (
    <SettingContainer onPress={onPress} isMarginLeft={isMarginLeft}>
      {image && <ButtonImage source={image} />}
      <ButtonText isMargin={isMargin} fontSize={fontSize} style={titleStyle} color={color}>
        {title}
      </ButtonText>
      {isArrow && <ImageContainer color={color} source={Images.right_arrow} />}
    </SettingContainer>
  )
}

export default SettingButton

const SettingContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: ${(props: any) => (props?.isMarginLeft ? scale(20) : 0)}px;
  margin-right: ${(props: any) => (props?.isMarginLeft ? scale(20) : 0)}px;
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
  /* background-color: red; */
`
const ButtonText = styled.Text`
  margin-left: ${(props: any) => (!props?.isMargin ? scale(16) : scale(10))}px;
  font-family: ${Fonts.ThemeRegular};
  font-size: ${(props: any) => moderateScale(props?.fontSize)}px;
  flex: 1;
  color: ${(props: any) => props?.color || Colors.blackShade236};
`
const ButtonImage = styled.Image`
  /* width: ${verticalScale(30)}px;
  height: ${verticalScale(30)}px;
  tint-color: ${Colors.blackShade236}; */
`
