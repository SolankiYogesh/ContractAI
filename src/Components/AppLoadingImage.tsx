import React, {useMemo} from 'react'
import {Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import {ResizeMode} from 'react-native-fast-image'
import {CachedImage} from '@georstat/react-native-image-cache'
import _ from 'lodash'

import {Images} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'

export interface AppLoadingImageProps {
  url?: string
  imageStyle?: StyleProp<ImageStyle>
  style?: StyleProp<ViewStyle>
  isLoadingView?: boolean
  resizeMode?: ResizeMode
  borderRadius?: number
}

const AppLoadingImage = (props: AppLoadingImageProps) => {
  const {imageStyle = {}, style = {}, url, resizeMode} = props

  const isHttp = useMemo(() => url?.includes('http'), [url])
  const ImageComponent = useMemo(
    () => (!_.isEmpty(url) && isHttp ? CachedImage : Image),
    [isHttp, url]
  )

  return (
    <View style={[styles.container, style]}>
      <ImageComponent
        thumbnailSource={'https://cdn.pixabay.com/photo/2016/07/11/15/43/woman-1509956_1280.jpg'}
        resizeMode={resizeMode || 'cover'}
        source={(!_.isEmpty(url) && !isHttp ? {uri: url} : url) || Images.profile}
        style={[styles.image, imageStyle]}
      />
    </View>
  )
}

export default AppLoadingImage

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
