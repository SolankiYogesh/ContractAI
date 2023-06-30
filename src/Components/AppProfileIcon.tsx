import React, {memo} from 'react'
import {ImageStyle, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native'
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text'
import LinearGradient from 'react-native-linear-gradient'
import {useSelector} from 'react-redux'
import Skeleton from '@thevsstech/react-native-skeleton'

import {Colors} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'
import {moderateScale, scale, verticalScale} from '../Theme/Responsive'
import Utility from '../Theme/Utility'
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
  isImageLocal?: boolean
  fontSize?: number
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
    isLoading = false,
    isImageLocal = false,
    fontSize = moderateScale(30)
  } = props
  const user = useSelector((state: any) => state?.user?.userData)

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
      ) : url ? (
        <AppLoadingImage
          borderRadius={moderateScale(5)}
          url={url}
          isImageLocal={isImageLocal}
          style={[styles.profileImage, imageStyle]}
        />
      ) : (
        <LinearGradient
          colors={[Colors.ThemeColor, Colors.purpleShadB0]}
          start={{x: 0.0, y: 0.0}}
          end={{x: 1.0, y: 1.0}}
          locations={[0.29, 1]}
          style={[CommonStyles.centerItem, CommonStyles.viewFull, styles.profileImage]}
        >
          <AutoSizeText
            fontSize={fontSize}
            numberOfLines={1}
            adjustsFontSizeToFit
            allowFontScaling
            style={styles.textStyle}
            mode={ResizeTextMode.max_lines}
          >
            {Utility.convert(user?.first_name + ' ' + user?.last_name)}
          </AutoSizeText>
        </LinearGradient>
      )}
    </TouchableOpacity>
  )
}

export default memo(AppProfileImage)

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
    overflow: 'hidden',
    opacity: 1
  },
  borderZero: {
    borderWidth: 0
  },

  textStyle: {
    color: Colors.white
  }
})
