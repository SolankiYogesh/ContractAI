import React, {useCallback, useEffect, useRef, useState} from 'react'
import {StyleSheet, TextInput, View} from 'react-native'
import WebView from 'react-native-webview'
import {useSelector} from 'react-redux'
import {useNavigation, useRoute} from '@react-navigation/native'

import APICall from '../../../../APIRequest/APICall'
import AppConfig from '../../../../APIRequest/AppConfig'
import EndPoints from '../../../../APIRequest/EndPoints'
import AppContainer from '../../../../Components/AppContainer'
import AppHeader from '../../../../Components/AppHeader'
import BackButton from '../../../../Components/BackButton'
import Loader from '../../../../Components/Loader'
import LoadingView from '../../../../Components/LoadingView'
import Toast from '../../../../Components/Toast'
import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'

const OfferDetailsScreen = () => {
  const navigation = useNavigation()
  const route: any = useRoute().params
  const contactItem = route?.contactItem
  const [isEditable, setIsEditable] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const user: any = useSelector((state: any) => state?.user?.userData)
  const username = user?.first_name + ' ' + user?.last_name
  const isOfferScreen = route?.isOfferScreen
  const [bodyText, setBodyText] = useState('')

  const item = route?.item

  useEffect(() => {
    if (isEditable) {
      if (inputRef.current) {
        inputRef.current?.focus()
      }
    }
  }, [isEditable])

  useEffect(() => {
    const regex = /<\/?body>/gi
    const fomratedText =
      item?.email_body && typeof item?.email_body === 'string'
        ? item?.email_body
            ?.replace('[receiver_name]', contactItem?.name)
            ?.replace('[sender_name]', username)
            ?.replace(regex, '')
        : ''
    setBodyText(fomratedText)
  }, [contactItem?.name, item?.email_body, username])

  const onPressSend = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }

    if (bodyText) {
      const payload = {
        email_type: item?.email_type,
        email_body: bodyText,
        to_email: contactItem?.email,
        receiver_name: contactItem?.name,
        from_email: user?.email,
        sender_name: username
      }
      Loader.isLoading(true)
      APICall('get', payload, EndPoints.getEmailTemplates)
        .then(async (resp: any) => {
          Loader.isLoading(false)

          if (resp?.status === 200 && resp?.data) {
            await Utility.wait()
            Toast.show('Email sent!')

            navigation.goBack()
          }
        })
        .catch(() => {
          Loader.isLoading(false)
        })
    }
  }, [
    item?.email_type,
    bodyText,
    contactItem?.email,
    contactItem?.name,
    user?.email,
    username,
    navigation
  ])

  const onPressSendContract = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    if (contactItem?.email && contactItem?.cache_id) {
      const payload = {
        email_add: contactItem?.email,
        cache_id: contactItem?.cache_id
      }
      Loader.isLoading(true)

      APICall('post', payload, EndPoints.sendOffer)
        .then(async (resp: any) => {
          Loader.isLoading(false)

          if (resp?.status === 200 && resp?.data?.sendgrid_response_code === 200) {
            await Utility.wait()
            Toast.show('offer sent!')
            navigation.goBack()
          }
        })
        .catch(() => {
          Loader.isLoading(false)
        })
    }
  }, [contactItem, navigation])

  const onPressRight = useCallback(() => {
    if (isEditable) {
      Utility.showAlert('Template saved!')
      setIsEditable(false)
    } else {
      setIsEditable(true)
    }
  }, [isEditable])

  return (
    <AppContainer>
      <AppHeader
        rightImage={isEditable ? Images.right : Images.pencil}
        isBack
        onPressRight={onPressRight}
        title={item?.email_type || contactItem?.address || English.R158}
      />

      {isOfferScreen ? (
        <WebView
          source={{
            uri: AppConfig.API_URL + contactItem?.filled_form
          }}
          scalesPageToFit
          scrollEnabled
          startInLoadingState
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          renderLoading={() => <LoadingView style={StyleSheet.absoluteFill} />}
          overScrollMode={'never'}
          style={CommonStyles.flex}
        />
      ) : (
        !!bodyText && (
          <View style={styles.container}>
            <TextInput
              editable={isEditable}
              onChangeText={setBodyText}
              style={styles.input}
              multiline
              ref={inputRef}
              value={bodyText}
            />
          </View>
        )
      )}

      <BackButton
        onPress={() => {
          if (isOfferScreen) {
            onPressSendContract()
          } else {
            onPressSend()
          }
        }}
        colors={[Colors.ThemeColor, Colors.purpleShadB0]}
        style={styles.sendImage}
        image={Images.send}
        imageStyle={styles.imageStyle}
      />
    </AppContainer>
  )
}

export default OfferDetailsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: scale(15),
    borderRadius: moderateScale(20),
    padding: scale(10),
    ...CommonStyles.shadow,
    paddingHorizontal: scale(20)
  },
  sendImage: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 0,
    right: scale(20),
    borderRadius: moderateScale(10)
  },
  imageStyle: {
    tintColor: Colors.white
  },
  input: {
    flex: 1,
    fontFamily: Fonts.ThemeMedium,
    fontSize: moderateScale(14),
    color: Colors.black121928,
    alignItems: 'center',
    textAlign: 'justify',
    letterSpacing: 1,
    textTransform: 'capitalize'
  }
})
