import React, {useCallback} from 'react'
import {Keyboard, StyleSheet, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import BackButton from '../../../../../Components/BackButton'
import {Colors, Images, Screens} from '../../../../../Theme'
import {CommonStyles} from '../../../../../Theme/CommonStyles'
import {moderateScale, scale, verticalScale} from '../../../../../Theme/Responsive'
import Utility from '../../../../../Theme/Utility'
import {
  ContactContainer,
  NameText,
  NumberText
} from '../../../ContactListScreen/Components/ContactItem'
import TextToImage from '../../../ContactListScreen/Components/TextToImage'

const ShareItem = ({item, offerItem}: any) => {
  const navigation: any = useNavigation()
  const onPressShare = useCallback(() => {
    Keyboard.dismiss()
    navigation.replace(Screens.OfferDetailsScreen, {
      item: offerItem,
      contactItem: item
    })
  }, [offerItem, item, navigation])

  return (
    <ContactContainer isShared disabled>
      <TextToImage text={item?.value} />
      <View style={CommonStyles.flex}>
        <NameText>{item?.value}</NameText>
        <NumberText>{Utility.formateNumber(item?.number)}</NumberText>
      </View>
      <BackButton
        isHeader
        colors={[Colors.white, Colors.white]}
        imageStyle={styles.imageStyle}
        style={styles.btnStyle}
        onPress={onPressShare}
        image={Images.send}
      />
    </ContactContainer>
  )
}

export default ShareItem
const styles = StyleSheet.create({
  btnStyle: {
    marginRight: scale(15),
    width: verticalScale(60),
    height: verticalScale(60),
    borderRadius: moderateScale(10)
  },
  imageStyle: {
    tintColor: Colors.ThemeColor
  }
})
