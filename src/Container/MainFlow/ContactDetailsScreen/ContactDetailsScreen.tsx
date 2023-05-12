import React, {useCallback} from 'react'
import {Linking, StyleSheet, View} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import TextToImage from '../ContactListScreen/Components/TextToImage'

const ContactDetailsScreen = () => {
  const params: any = useRoute()?.params
  const data = params?.data
  const navigation: any = useNavigation()

  const onPressPhone = useCallback(() => {
    Linking.openURL(`tel:${params?.data?.number}`)
  }, [params?.data?.number])

  const onPressEmail = useCallback(() => {
    Linking.openURL(`mailto:${params?.data?.email}?subject=Subject&body=Body`)
  }, [params?.data?.email])

  const onPressSendOffer = useCallback(() => {
    navigation.navigate(Screens.OffersScreen)
  }, [navigation])
  const onPressSendTemplate = useCallback(() => {
    navigation.push(Screens.EmailTemplateScreen, {
      contactItem: data
    })
  }, [data, navigation])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R71} />
      <TextToImage style={styles.imageStyle} text={data?.value} />

      <UsernameText>{data?.value}</UsernameText>
      {params?.data?.number && (
        <AppInput
          ContainerStyle={styles.input}
          editable={false}
          value={Utility.formateNumber(params?.data?.number)}
          rightImage={Images.phone}
          onPress={onPressPhone}
        />
      )}
      {params?.data?.email && (
        <AppInput
          ContainerStyle={styles.input}
          editable={false}
          value={params?.data?.email}
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
