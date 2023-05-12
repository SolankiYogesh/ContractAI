import React from 'react'
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import {Colors} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'
import {Fonts} from '../Theme/Fonts'
import {INPUT_HEIGHT, moderateScale, scale, verticalScale} from '../Theme/Responsive'

interface AppButtonProps {
  title?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?: () => void
  leftImage?: ImageSourcePropType
  leftImageStyle?: StyleProp<ImageStyle>
  isGradient?: boolean
  disabled?: boolean
}

const AppButton = (props: AppButtonProps) => {
  const {
    onPress = () => {},
    leftImageStyle = {},
    style = {},
    textStyle = {},
    title = '',
    leftImage,
    isGradient = true,
    disabled = false
  } = props
  return (
    <ButtonContainer disabled={disabled} style={style} onPress={onPress}>
      <LinearGradient
        colors={
          isGradient && !disabled
            ? [Colors.purpleShad8A, Colors.purpleShadB0]
            : disabled
            ? [Colors.greyOutColor, Colors.greyOutColor]
            : [Colors.transparent, Colors.transparent]
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={91.48}
        style={[CommonStyles.flex, CommonStyles.centerItem, disabled && styles.disabledButton]}
      >
        <InnerView>
          {!!leftImage && (
            <LeftImageContainer style={leftImageStyle} source={leftImage} resizeMode={'contain'} />
          )}
          <TitleText disabled={disabled} style={textStyle}>
            {title}
          </TitleText>
        </InnerView>
      </LinearGradient>
    </ButtonContainer>
  )
}

export default AppButton
const ButtonContainer = styled.TouchableOpacity`
  width: 80%;
  height: ${INPUT_HEIGHT}px;
  border-radius: ${moderateScale(15)}px;
  align-self: center;
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
  overflow: hidden;
`

const TitleText = styled.Text`
  font-family: ${Fonts.ThemeSemiBold};
  color: ${(props: any) => (props?.disabled ? Colors.greyShade595 : Colors.white)};
  font-size: ${moderateScale(15)}px;
`

const LeftImageContainer = styled.Image`
  height: ${verticalScale(22)}px;
  margin-right: ${scale(10)}px;
  width: ${verticalScale(22)}px;
`

const InnerView = styled.View`
  flex-direction: row;
  width: 60%;
  align-items: center;
  align-self: center;
  justify-content: center;
`
const styles = StyleSheet.create({
  disabledButton: {
    borderWidth: 2,
    borderColor: Colors.greyShadeE8
  }
})
