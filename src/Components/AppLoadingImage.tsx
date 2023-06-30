import React, {memo, useState} from 'react'
import {ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import FastImage, {ResizeMode} from 'react-native-fast-image'

import {CommonStyles} from '../Theme/CommonStyles'
import LoadingView from './LoadingView'

export interface AppLoadingImageProps {
  url?: string
  imageStyle?: StyleProp<ImageStyle>
  style?: StyleProp<ViewStyle>
  isLoadingView?: boolean
  resizeMode?: ResizeMode
  borderRadius?: number
  isImageLocal?: boolean
}

const AppLoadingImage = (props: AppLoadingImageProps) => {
  const {imageStyle = {}, style = {}, url, resizeMode, isImageLocal = false} = props
  const [loading, setLoading] = useState(false)

  return (
    <View style={[styles.container, style]}>
      <FastImage
        resizeMode={resizeMode || 'cover'}
        source={isImageLocal ? url : {uri: url}}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={[styles.image, imageStyle]}
      />
      {loading && <LoadingView style={StyleSheet.absoluteFill} />}
    </View>
  )
}

export default memo(AppLoadingImage)

AppLoadingImage.defaultProps = {
  url: '',
  imageStyle: {},
  style: {},
  isLoadingView: true,
  resizeMode: 'cover'
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.centerItem
  },
  image: {
    width: '100%',
    height: '100%'
  }
})
