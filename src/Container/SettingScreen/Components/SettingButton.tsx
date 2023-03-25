import React from 'react'
import {ImageSourcePropType} from 'react-native'
import styled from 'styled-components/native'

import {Colors, Images} from '../../../Theme'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import {ImageContainer} from '../SettingScreen'

interface SettingButtonProps {
  title?: string
  image?: ImageSourcePropType
  isArrow?: boolean
  onPress?: () => void
  color?: string
  isMarginLeft?: boolean
}

const SettingButton = (props: SettingButtonProps) => {
  const {title, image, isArrow = false, onPress = () => {}, color = '', isMarginLeft = true} = props
  return (
    <SettingContainer onPress={onPress} isMarginLeft={isMarginLeft}>
      {image && <ButtonImage source={image} />}
      <ButtonText color={color}>{title}</ButtonText>
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
`
const ButtonText = styled.Text`
  margin-left: ${scale(15)}px;
  font-family: ${Fonts.ThemeRegular};
  font-size: ${moderateScale(14)}px;
  flex: 1;
  color: ${(props: any) => props?.color || Colors.blackShade236};
`
const ButtonImage = styled.Image`
  width: ${verticalScale(30)}px;
  height: ${verticalScale(30)}px;
  tint-color: ${Colors.blackShade236};
`
