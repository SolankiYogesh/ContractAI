import React, {useMemo, useRef} from 'react'
import {StyleSheet, View} from 'react-native'
import WebView from 'react-native-webview'
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet'

import EndPoints from '../APIRequest/EndPoints'
import {Colors} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'
import {heightPx, moderateScale, scale, verticalScale} from '../Theme/Responsive'
import LoadingView from './LoadingView'

interface TNCSheetProps {
  onClose: () => void
  isPrivacy?: boolean
}
const TNCSheet = ({onClose = () => {}, isPrivacy = false}: TNCSheetProps) => {
  const snapPoints = useMemo(() => [heightPx(86)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  return (
    <BottomSheet
      enablePanDownToClose
      onClose={onClose}
      ref={bottomSheetRef}
      containerStyle={styles.containerStyle}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      handleHeight={verticalScale(10)}
      handleStyle={styles.handleStyle}
      snapPoints={snapPoints}
      style={styles.bottomSheetStyle}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={'close'}
          {...props}
        />
      )}
    >
      <View style={CommonStyles.flex}>
        <WebView
          source={{
            uri: isPrivacy ? EndPoints.privacy : EndPoints.TNC
          }}
          scalesPageToFit
          scrollEnabled
          startInLoadingState
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          renderLoading={() => <LoadingView style={StyleSheet.absoluteFill} />}
          overScrollMode={'never'}
          style={CommonStyles.flex}
        />
        <View style={styles.webviewStyle} />
      </View>
    </BottomSheet>
  )
}

export default TNCSheet

const styles = StyleSheet.create({
  bottomSheetStyle: {
    borderRadius: moderateScale(15),
    padding: scale(20)
  },
  handleStyle: {
    bottom: verticalScale(10)
  },
  handleIndicatorStyle: {
    backgroundColor: Colors.greyShadeEBEB,
    width: scale(50)
  },
  containerStyle: {
    zIndex: 1000
  },
  webviewStyle: {
    height: verticalScale(50)
  }
})
