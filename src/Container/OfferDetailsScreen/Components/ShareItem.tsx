import React from 'react'
import {StyleSheet, View} from 'react-native'

import BackButton from '../../../Components/BackButton'
import {Colors, Images} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import {
  ContactContainer,
  ImageContainer,
  NameText,
  NumberText
} from '../../ContactListScreen/Components/ContactItem'

const ShareItem = ({item}: any) => {
  return (
    <ContactContainer disabled>
      <ImageContainer
        source={{
          uri: item?.image
        }}
        resizeMode={'cover'}
      />
      <View style={CommonStyles.flex}>
        <NameText>{item?.value}</NameText>
        <NumberText>{item?.phone}</NumberText>
      </View>
      <BackButton
        isHeader
        colors={[Colors.white, Colors.white]}
        imageStyle={styles.imageStyle}
        style={styles.btnStyle}
        onPress={() => {}}
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
