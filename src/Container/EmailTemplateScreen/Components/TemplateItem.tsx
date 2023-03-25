import React, {useCallback} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'

interface TemplateItemProps {
  title?: string
}

const TemplateItem = ({title = ''}: TemplateItemProps) => {
  const navigation: any = useNavigation()

  const onPressTemplate = useCallback(() => {
    navigation.navigate(Screens.OfferDetailsScreen, {
      offerName: title
    })
  }, [navigation, title])
  return (
    <TouchableOpacity onPress={onPressTemplate} style={styles.templateContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <Image source={Images.send} resizeMode={'contain'} style={styles.sendImage} />
    </TouchableOpacity>
  )
}

export default TemplateItem
const styles = StyleSheet.create({
  templateContainer: {
    ...CommonStyles.shadow,
    padding: scale(15),
    marginHorizontal: scale(20),
    marginVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.ThemeBold,
    color: Colors.ThemeColor,
    flex: 1
  },
  sendImage: {
    width: verticalScale(30),
    height: verticalScale(30),
    tintColor: Colors.ThemeColor
  }
})
