import React, {useCallback, useEffect, useState} from 'react'
import {Linking, StyleSheet} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import TextToImage from '../ContactListScreen/Components/TextToImage'

const ContactDetailsScreen = () => {
  const params: any = useRoute()?.params
  const data = params?.data
  const navigation: any = useNavigation()
  const [email, setEmail] = useState(data?.email || '')
  const [emailError, setEmailError] = useState('')
  const [submitPressed, setSubmitPressed] = useState(false)
  const [isEnabled, setISEnabled] = useState(false)
  const isOfferScreen = params?.isOfferScreen
  const offerItem = params?.offerItem

  useEffect(() => {
    setISEnabled(!!Utility.isEmpty(email) && !!Utility.isEmpty(data?.number))
  }, [email, data?.number])

  const onPressPhone = useCallback(() => {
    if (data?.number) {
      Linking.openURL(`tel:${data?.number}`)
    }
  }, [data?.number])

  const onPressEmail = useCallback(() => {
    if (email) {
      Linking.openURL(`mailto:${email}?subject=Subject&body=Body`)
    }
  }, [email])

  const onContactUpdate = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    if (!data?.email && email) {
      const url = EndPoints.updateContact.replace('ID', data?.id)
      const payload = {
        email,
        name: data?.name,
        number: data?.number
      }
      APICall('put', payload, url)
    }
  }, [data?.email, data?.id, data?.name, data?.number, email])

  const onChangeEmail = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (Utility.isValid(email)) {
          errorMessage = English.R163
        }
      }
      setEmail(text)
      setEmailError(errorMessage)
    },
    [email, submitPressed]
  )

  const onPressSendOffer = useCallback(() => {
    onContactUpdate()
    setSubmitPressed(true)
    if (Utility.isValid(email)) {
      setEmailError(English.R163)
      return
    }
    if (isOfferScreen) {
      navigation.navigate(Screens.OfferDetailsScreen, {
        contactItem: {...(offerItem || {}), email},
        isOfferScreen: true
      })
      return
    }
    navigation.navigate(Screens.OffersScreen, {
      data: {...(data || {}), email}
    })
  }, [data, email, isOfferScreen, navigation, offerItem, onContactUpdate])
  const onPressSendTemplate = useCallback(() => {
    onContactUpdate()

    setSubmitPressed(true)
    if (Utility.isValid(email)) {
      setEmailError(English.R163)
      return
    }
    navigation.push(Screens.EmailTemplateScreen, {
      contactItem: data
    })
  }, [data, email, navigation, onContactUpdate])

  return (
    <AppContainer style={CommonStyles.flex}>
      <AppHeader isBack title={English.R71} />
      <AppScrollView scrollEnabled={false}>
        <TextToImage fontSize={50} style={styles.imageStyle} text={data?.value} />
        <UsernameText>{data?.value}</UsernameText>
        {data?.number && (
          <AppInput
            onChangeText={setEmail}
            ContainerStyle={styles.input}
            editable={false}
            value={Utility.formateNumber(data?.number)}
            rightImage={Images.phone}
            onPress={onPressPhone}
          />
        )}

        <AppInput
          ContainerStyle={styles.input}
          editable={!data?.email}
          placeholder={English.R47}
          value={email}
          error={emailError}
          errorStyle={styles.errorStyle}
          onChangeText={onChangeEmail}
          rightImage={Images.email_2}
          onPress={onPressEmail}
        />
      </AppScrollView>

      <AppButton
        disabled={!isEnabled}
        style={[styles.input, isOfferScreen && styles.marginBottom]}
        onPress={onPressSendOffer}
        title={English.R72}
        leftImage={Images.send_email}
        leftImageStyle={[styles.leftImageStyle, !isEnabled && styles.disabledLeftImageStyle]}
      />

      {!isOfferScreen && (
        <AppButton
          leftImage={Images.template}
          textStyle={styles.textStyle}
          style={styles.buttonStyle}
          onPress={onPressSendTemplate}
          isGradient={false}
          title={English.R73}
        />
      )}
    </AppContainer>
  )
}

export default ContactDetailsScreen

const styles = StyleSheet.create({
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
  },
  errorStyle: {
    marginHorizontal: scale(20)
  },
  marginBottom: {
    marginBottom: verticalScale(20)
  },
  leftImageStyle: {
    tintColor: Colors.white,
    width: verticalScale(25),
    height: verticalScale(25)
  },
  disabledLeftImageStyle: {
    tintColor: Colors.greyShade595
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
