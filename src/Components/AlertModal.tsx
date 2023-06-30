import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import ReactNativeModal from 'react-native-modal'
import _ from 'lodash'

import English from '../Resources/Locales/English'
import {Colors} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../Theme/Responsive'

export interface ButtonType {
  title: string
  style?: 'cancel' | 'default'
  onPress?: () => void
}
export interface AlertModalRef {
  showLoader: (massage: string, buttons: ButtonType[]) => void
}

const AlertModal = forwardRef<AlertModalRef, any>((props, ref) => {
  const [isVisible, setISVisible] = useState(false)
  const [massage, setMessage] = useState('')
  const [button, setButtons] = useState<ButtonType[]>([])
  const {height} = Dimensions.get('screen')
  const onPressClose = useCallback(() => setISVisible(false), [])

  const defaultButtons: ButtonType[] = useMemo(
    () => [
      {
        title: 'OK',
        style: 'cancel',
        onPress: onPressClose
      }
    ],
    [onPressClose]
  )
  useImperativeHandle(ref, () => ({
    showLoader(m: string, buttons: ButtonType[]) {
      setMessage(m)
      if (buttons.length > 0) {
        setButtons(buttons)
      } else {
        setButtons(defaultButtons)
      }
      setISVisible(true)
    }
  }))

  return (
    <ReactNativeModal
      backdropOpacity={0.4}
      animationOut={'fadeOut'}
      animationIn={'fadeIn'}
      animationInTiming={100}
      animationOutTiming={100}
      isVisible={isVisible}
      deviceHeight={height}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Text style={styles.title}>{English.R203}</Text>
        <Text style={styles.descText}>{massage}</Text>
        <View style={styles.separator} />
        {_.map(button, (i: ButtonType) => {
          return (
            <>
              <TouchableOpacity
                hitSlop={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                  top: 0
                }}
                onPress={() => {
                  if (i.style === 'cancel') {
                    onPressClose()
                  } else if (i.onPress) {
                    onPressClose()
                    i.onPress()
                  }
                }}
                key={i?.title}
                style={styles.buttonContainer}
              >
                <Text adjustsFontSizeToFit style={styles.btnText}>
                  {i.title}
                </Text>
              </TouchableOpacity>
              <View style={styles.separator} />
            </>
          )
        })}
      </View>
    </ReactNativeModal>
  )
})
export default AlertModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(15),
    width: '80%',
    alignSelf: 'center',
    overflow: 'hidden',
    paddingTop: scale(20)
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: scale(20),
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    fontFamily: Fonts.ThemeBold,
    color: Colors.black
  },
  descText: {
    textAlign: 'center',
    paddingHorizontal: scale(20),
    fontSize: moderateScale(13),
    fontFamily: Fonts.ThemeMedium,
    padding: verticalScale(10),
    color: Colors.black
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: verticalScale(10)
  },
  separator: {
    height: verticalScale(1),
    backgroundColor: Colors.grayShadeF4
  },
  btnText: {
    fontSize: moderateScale(17),
    color: Colors.blueShade007,
    fontFamily: Fonts.ThemeMedium
  }
})
