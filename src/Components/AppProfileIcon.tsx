import React from 'react'
import {ImageStyle, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native'
import Skeleton from '@thevsstech/react-native-skeleton'

import {Colors} from '../Theme'
import {moderateScale, scale, verticalScale} from '../Theme/Responsive'
import AppLoadingImage from './AppLoadingImage'

interface AppProfileImageProps {
  onPress?: () => void
  borderWidth?: number
  borderColor?: string
  url?: string
  imageStyle?: StyleProp<ImageStyle>
  style?: StyleProp<ViewStyle>
  size?: number
  borderRadius?: number
  activeOpacity?: number
  isLoading?: boolean
}

const AppProfileImage = (props: AppProfileImageProps) => {
  const {
    onPress,
    borderWidth,
    url,
    size = 50,
    imageStyle,
    style,
    borderColor,
    borderRadius = 15,
    activeOpacity = 0.5,
    isLoading = false
  } = props

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderWidth,
          borderColor,
          width: verticalScale(size),
          height: verticalScale(size),
          borderRadius: moderateScale(borderRadius)
        },
        isLoading && styles.borderZero,
        style
      ]}
      activeOpacity={activeOpacity}
      disabled={!onPress}
      onPress={onPress}
    >
      {isLoading ? (
        <Skeleton>
          <Skeleton.Item
            borderColor={Colors.transparent}
            borderRadius={borderRadius}
            width={size}
            borderWidth={0}
            height={size}
          />
        </Skeleton>
      ) : (
        <AppLoadingImage
          borderRadius={moderateScale(5)}
          url={url}
          style={[styles.profileImage, imageStyle]}
        />
      )}
    </TouchableOpacity>
  )
}

export default AppProfileImage

AppProfileImage.defaultProps = {
  borderWidth: scale(2),
  url: '',
  size: 50,
  imageStyle: {},
  style: {},
  borderColor: Colors.ThemeColor,
  borderRadius: 15
}

const styles = StyleSheet.create({
  profileImage: {
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  container: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderWidth: scale(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.ThemeColor,
    borderRadius: moderateScale(15),
    overflow: 'hidden'
  },
  borderZero: {
    borderWidth: 0
  }
})
