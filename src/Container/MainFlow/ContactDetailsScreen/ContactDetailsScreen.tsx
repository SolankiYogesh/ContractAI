import React, {useCallback, useEffect, useState} from 'react'
import {Linking, StyleSheet} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import _ from 'lodash'
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
  const isTemplateScreen = params?.isTemplateScreen

  useEffect(() => {
    setISEnabled(!!Utility.isEmpty(email) && !!Utility.isEmpty(data?.number))
  }, [email, data?.number])

  const onPressPhone = useCallback(() => {
    if (data?.number) {
      Linking.openURL(`tel:${data?.number}`)
    }
  }, [data?.number])

  const onContactUpdate = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    if (_.trim(email)) {
      const url = EndPoints.updateContact.replace('ID', data?.id)
      const payload = {
        email,
        name: data?.name,
        number: data?.number
      }
      APICall('put', payload, url)
    }
  }, [data?.id, data?.name, data?.number, email])

  const onChangeEmail = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (Utility.isValid(text)) {
          errorMessage = English.R163
        }
      }
      setEmail(text)
      setEmailError(errorMessage)
    },
    [submitPressed]
  )

  const onPressSendOffer = useCallback(() => {
    setSubmitPressed(true)
    if (Utility.isValid(email)) {
      setEmailError(English.R163)
      return
    }
    onContactUpdate()
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
    setSubmitPressed(true)
    if (Utility.isValid(email)) {
      setEmailError(English.R163)
      return
    }

    onContactUpdate()
    if (isTemplateScreen) {
      navigation.navigate(Screens.OfferDetailsScreen, {
        item: offerItem,
        contactItem: {...(data || {}), email}
      })
      return
    }
    navigation.push(Screens.EmailTemplateScreen, {
      contactItem: data
    })
  }, [data, email, isTemplateScreen, navigation, offerItem, onContactUpdate])

  return (
    <AppContainer style={CommonStyles.flex}>
      <AppHeader isBack />
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
          placeholder={English.R47}
          value={email}
          keyboardType={'email-address'}
          error={emailError}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          errorStyle={styles.errorStyle}
          onChangeText={onChangeEmail}
          rightImage={Images.email_2}
        />
      </AppScrollView>

      {!isTemplateScreen && (
        <AppButton
          disabled={!isEnabled}
          style={[styles.input, isOfferScreen && styles.marginBottom]}
          onPress={onPressSendOffer}
          title={English.R72}
          innerStyle={styles.innerStyle}
          leftImage={Images.contract}
          leftImageStyle={[styles.leftImageStyle, !isEnabled && styles.disabledLeftImageStyle]}
        />
      )}

      {!isOfferScreen && (
        <AppButton
          leftImage={Images.template}
          textStyle={[styles.textStyle]}
          style={[styles.buttonStyle, isTemplateScreen && styles.marginBottom]}
          onPress={onPressSendTemplate}
          isGradient={false}
          innerStyle={styles.innerStyle}
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

  innerStyle: {
    width: '40%',
    justifyContent: 'flex-start'
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
    marginBottom: verticalScale(30)
  },
  leftImageStyle: {
    tintColor: Colors.white
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
