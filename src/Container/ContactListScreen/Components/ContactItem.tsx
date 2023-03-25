import React, {useCallback} from 'react'
import {StyleSheet, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import BackButton from '../../../Components/BackButton'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import TextToImage from './TextToImage'

const ContactItem = ({item}: any) => {
  const navigation: any = useNavigation()

  const onPressContact = useCallback(() => {
    navigation.navigate(Screens.ContactDetailsScreen, {
      data: item
    })
  }, [])

  return (
    <ContactContainer onPress={onPressContact}>
      {item?.profileImage ? (
        <ImageContainer
          source={{
            uri: item?.profileImage
          }}
          resizeMode={'cover'}
        />
      ) : (
        <TextToImage text={item?.value} />
      )}
      <View style={CommonStyles.flex}>
        <NameText>{item?.value}</NameText>
        <NumberText>{item?.phoneNumbers[0]?.number}</NumberText>
      </View>
      <BackButton
        isHeader
        imageStyle={styles.imageStyle}
        style={styles.btnStyle}
        disabled
        image={Images.rightTriangle}
      />
    </ContactContainer>
  )
}

export default ContactItem

export const ContactContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
`

export const ImageContainer = styled.Image`
  width: ${verticalScale(50)}px;
  height: ${verticalScale(50)}px;
  border-radius: 15px;
  margin-right: 15px;
  margin-left: 15px;
`

export const NameText = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-family: ${Fonts.ThemeMedium};
  color: ${Colors.blackShade2A30};
`

export const NumberText = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-family: ${Fonts.ThemeMedium};
  color: ${Colors.greyCDCFD0};
`
const styles = StyleSheet.create({
  btnStyle: {
    marginRight: scale(15),
    width: verticalScale(30),
    height: verticalScale(30),
    borderRadius: moderateScale(10)
  },
  imageStyle: {
    tintColor: Colors.black
  }
})
