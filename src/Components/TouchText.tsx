import React from 'react'
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native'
import styled from 'styled-components/native'

import {Colors} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, verticalScale} from '../Theme/Responsive'

interface TouchTextProps {
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined
  color?: string
  fontSize?: number
  fontFamily?: string | undefined
  onPress?: () => void
  text?: string
  marginTop?: number
  marginBottom?: number
  style?: StyleProp<ViewStyle>
}

const TouchText = (props: TouchTextProps) => {
  const {
    color,
    fontFamily,
    fontSize,
    textAlign,
    onPress,
    text = '',
    marginTop,
    marginBottom,
    style = {}
  } = props
  return (
    <TouchableOpacity style={style} disabled={!onPress} onPress={onPress} activeOpacity={1}>
      <ForgotPasswordText
        fontFamily={fontFamily}
        fontSize={fontSize}
        color={color}
        textAlign={textAlign}
        marginTop={marginTop}
        marginBottom={marginBottom}
      >
        {text}
      </ForgotPasswordText>
    </TouchableOpacity>
  )
}

export default TouchText

export const ForgotPasswordText = styled.Text`
  text-align: ${(props: any) => props?.textAlign || 'left'};
  margin-top: ${(props: any) => props?.marginTop || verticalScale(5)}px;
  margin-bottom: ${(props: any) => props?.marginBottom || verticalScale(5)}px;
  color: ${(props: any) => props?.color || Colors.ThemeColor};
  font-size: ${(props: any) => props?.fontSize || moderateScale(14)}px;
  font-family: ${(props: any) => props?.fontFamily || Fonts.ThemeMedium};
`
