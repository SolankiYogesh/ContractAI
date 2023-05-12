import React from 'react'
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native'

import {Colors} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale} from '../Theme/Responsive'

interface ErrorTextProps {
  errorText?: string
  style?: StyleProp<TextStyle>
}

const ErrorText = (props: ErrorTextProps) => {
  const {errorText = '', style = {}} = props
  return <Text style={[styles.errorTextStyle, style]}>{errorText}</Text>
}

export default ErrorText

const styles = StyleSheet.create({
  errorTextStyle: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.ThemeMedium,
    color: Colors.redShade
  }
})
