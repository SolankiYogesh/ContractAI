import React from 'react'
import {Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native'

import {Images} from '../Theme'
import {scale, verticalScale} from '../Theme/Responsive'

interface AppLogoProps {
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
}

const AppLogo = (props: AppLogoProps) => {
  const {imageStyle = {}, style = {}} = props
  return (
    <View style={[styles.container, style]}>
      <Image resizeMode={'contain'} source={Images.logo} style={[styles.logoImage, imageStyle]} />
    </View>
  )
}

export default AppLogo

const styles = StyleSheet.create({
  container: {
    width: scale(80),
    height: verticalScale(75),
    alignSelf: 'center',
    flex: 1
  },
  logoImage: {
    width: '100%',
    height: '100%'
  }
})
