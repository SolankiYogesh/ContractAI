import React, {useCallback} from 'react'
import {Linking, StyleSheet, View} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import _ from 'lodash'
import styled from 'styled-components/native'

import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppInput from '../../Components/AppInput'
import English from '../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../Theme'
import {Fonts} from '../../Theme/Fonts'
import {moderateScale, verticalScale} from '../../Theme/Responsive'
import TextToImage from '../ContactListScreen/Components/TextToImage'

const ContactDetailsScreen = () => {
  const params: any = useRoute()?.params
  const data = params?.data
  const phoneNumber = _.find(data?.phoneNumbers, (i) => !!i?.number)
  const emailAddresses = _.find(data?.emailAddresses, (i) => !!i?.email)
  const navigation: any = useNavigation()

  const onPressPhone = useCallback(() => {
    Linking.openURL(`tel:${phoneNumber}`)
  }, [phoneNumber])

  const onPressEmail = useCallback(() => {
    Linking.openURL(`mailto:${emailAddresses?.email}?subject=Subject&body=Body`)
  }, [emailAddresses])

  const onPressSendOffer = useCallback(() => {
    navigation.navigate(Screens.OffersScreen)
  }, [navigation])
  const onPressSendTemplate = useCallback(() => {
    navigation.navigate(Screens.EmailTemplateScreen)
  }, [navigation])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R71} />
      {data?.profileImage ? (
        <ImageContainer
          source={{
            uri: data?.profileImage
          }}
          resizeMode={'cover'}
        />
      ) : (
        <TextToImage style={styles.imageStyle} text={data?.value} />
      )}

      <UsernameText>{data?.value}</UsernameText>
      {phoneNumber?.number && (
        <AppInput
          ContainerStyle={styles.input}
          editable={false}
          value={phoneNumber?.number}
          rightImage={Images.phone}
          onPress={onPressPhone}
        />
      )}
      {emailAddresses?.email && (
        <AppInput
          ContainerStyle={styles.input}
          editable={false}
          value={emailAddresses?.email}
          rightImage={Images.email_2}
          onPress={onPressEmail}
        />
      )}
      <View style={styles.container}>
        <AppButton style={styles.input} onPress={onPressSendOffer} title={English.R72} />

        <AppButton
          leftImage={Images.template}
          textStyle={styles.textStyle}
          style={styles.buttonStyle}
          onPress={onPressSendTemplate}
          isGradient={false}
          title={English.R73}
        />
      </View>
    </AppContainer>
  )
}

export default ContactDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  imageStyle: {
    width: verticalScale(150),
    height: verticalScale(150),
    borderRadius: moderateScale(300),
    alignSelf: 'center',
    marginTop: verticalScale(20)
  },
  input: {
    width: '90%',
    alignSelf: 'center'
  },
  buttonStyle: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.ThemeColor,
    borderWidth: 1,
    marginBottom: verticalScale(20)
  },
  textStyle: {
    color: Colors.ThemeColor
  }
})

const UsernameText = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.black};
  align-self: center;
  margin-top: 10px;
  margin-bottom: 30px;
`

const ImageContainer = styled.Image`
  width: ${verticalScale(150)}px;
  height: ${verticalScale(150)}px;
  border-radius: 15px;
  margin-right: 15px;
  margin-left: 15px;
  align-self: center;
  margin-top: ${verticalScale(10)};
  border-radius: 300px;
`
