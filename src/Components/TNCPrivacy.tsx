import React from 'react'
import {Image, Pressable, StyleSheet, Text, View} from 'react-native'

import English from '../Resources/Locales/English'
import {Colors, Images} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../Theme/Responsive'

interface TNCPrivacyProps {
  onPressTNC: () => void
  onPressPrivacy: () => void
  onChangeValue: (state: boolean) => void
  value: boolean
}

const TNCPrivacy = ({
  value = false,
  onPressTNC = () => {},
  onPressPrivacy = () => {},
  onChangeValue = () => {}
}: TNCPrivacyProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onChangeValue(!value)} style={styles.checkBox}>
        {value && <Image style={styles.check} source={Images.right} />}
      </Pressable>
      <Text style={styles.parentText}>
        {English.R194}
        <Text onPress={onPressTNC} style={styles.childText}>
          {English.R195}
        </Text>
        <Text style={styles.childText}>{English.R198}</Text>
        <Text onPress={onPressPrivacy} style={styles.childText}>
          {English.R197}
        </Text>
      </Text>
    </View>
  )
}

export default TNCPrivacy

const styles = StyleSheet.create({
  parentText: {
    color: Colors.PlaceHolderColor,
    fontSize: moderateScale(14),
    lineHeight: 25,
    fontWeight: '500',
    fontFamily: Fonts.ThemeMedium,
    flex: 1
  },
  childText: {
    color: Colors.blueShade1A8,
    textDecorationLine: 'underline'
  },
  container: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(50),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkBox: {
    height: moderateScale(18),
    width: moderateScale(18),
    borderRadius: moderateScale(5),
    borderColor: Colors.ThemeColor,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10)
  },
  check: {
    width: '80%',
    height: '80%'
  }
})
