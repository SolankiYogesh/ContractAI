import React, {useState} from 'react'
import {
  ActivityIndicator,
  Image,
  ImageResizeMode,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'

import {Colors} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'

export interface AppLoadingImageProps {
  url?: string
  imageStyle?: StyleProp<ImageStyle>
  style?: StyleProp<ViewStyle>
  isLoadingView?: boolean
  resizeMode?: ImageResizeMode
  borderRadius?: number
}

const AppLoadingImage = (props: AppLoadingImageProps) => {
  const {isLoadingView, imageStyle = {}, style = {}, url, resizeMode} = props
  const [isLoading, setISLoading] = useState(true)

  return (
    <View style={[styles.container, style]}>
      {isLoadingView && isLoading && (
        <View style={styles.loadingView}>
          <ActivityIndicator size={'large'} color={Colors.ThemeColor} />
        </View>
      )}
      <Image
        onError={() => setISLoading(false)}
        onLoad={(e) => setISLoading(false)}
        resizeMode={resizeMode}
        source={{uri: url}}
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
  loadingView: {
    position: 'absolute',
    zIndex: 1000
  },
  container: {
    ...CommonStyles.centerItem
  },
  image: {
    width: '100%',
    height: '100%'
  }
})
