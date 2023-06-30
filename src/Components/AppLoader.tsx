import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react'
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native'
import ReactNativeModal from 'react-native-modal'

import {Colors} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'
import {moderateScale, verticalScale} from '../Theme/Responsive'
import Loader from './Loader'

const AppLoader = forwardRef((props, ref) => {
  const [isVisible, setISVisible] = useState(false)
  const isCallBackRef = useRef(false)
  const {height} = Dimensions.get('screen')

  useImperativeHandle(ref, () => ({
    showLoader(state: boolean, isCallBack = false) {
      setISVisible(state)
      isCallBackRef.current = isCallBack
    }
  }))

  return (
    <ReactNativeModal
      statusBarTranslucent
      onModalHide={() => {
        if (Loader?.onModalHideCallback && isCallBackRef.current) {
          Loader?.onModalHideCallback()
        }
      }}
      isVisible={isVisible}
      deviceHeight={height}
      animationInTiming={300}
      animationOutTiming={300}
      style={[CommonStyles.modalStyle, CommonStyles.centerItem]}
    >
      <View style={styles.contianer}>
        <ActivityIndicator size={'large'} color={Colors.ThemeColor} />
      </View>
    </ReactNativeModal>
  )
})

export default AppLoader

const styles = StyleSheet.create({
  contianer: {
    width: verticalScale(100),
    height: verticalScale(100),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6
  }
})
