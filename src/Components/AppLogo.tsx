import React from 'react'
import {Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native'

import {Images} from '../Theme'
import {scale, verticalScale} from '../Theme/Responsive'
import BackButton from './BackButton'

interface AppLogoProps {
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  isBack?: boolean
  onPressBack?: () => void
}

const AppLogo = (props: AppLogoProps) => {
  const {imageStyle = {}, style = {}, isBack = false, onPressBack = () => {}} = props
  return (
    <View style={styles.mainContianer}>
      {isBack && <BackButton onPress={onPressBack} parentStyle={styles.image} />}
      <View style={[styles.container, style]}>
        <Image resizeMode={'contain'} source={Images.logo} style={[styles.logoImage, imageStyle]} />
      </View>
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
  },
  mainContianer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  image: {
    position: 'absolute',
    top: verticalScale(15),
    zIndex: 1000
  }
})
