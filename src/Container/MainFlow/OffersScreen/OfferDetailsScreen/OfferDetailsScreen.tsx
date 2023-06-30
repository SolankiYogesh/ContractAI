import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Pressable, StyleSheet, TextInput, View} from 'react-native'
import WebView from 'react-native-webview'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigation, useRoute} from '@react-navigation/native'

import APICall from '../../../../APIRequest/APICall'
import AppConfig from '../../../../APIRequest/AppConfig'
import EndPoints from '../../../../APIRequest/EndPoints'
import AlertLoader from '../../../../Components/AlertLoader'
import AppContainer from '../../../../Components/AppContainer'
import AppHeader from '../../../../Components/AppHeader'
import AppScrollView from '../../../../Components/AppScrollView'
import BackButton from '../../../../Components/BackButton'
import Loader from '../../../../Components/Loader'
import LoadingView from '../../../../Components/LoadingView'
import Toast from '../../../../Components/Toast'
import {setPlanData} from '../../../../Redux/Reducers/UserSlice'
import English from '../../../../Resources/Locales/English'
import {Colors, Constant, Images, Screens} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, W_HEIGHT} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'

const OfferDetailsScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute().params
  const contactItem = route?.contactItem
  const [isEditable, setIsEditable] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)
  const dispatch = useDispatch()
  const user: any = useSelector((state: any) => state?.user?.userData)
  const username = user?.first_name + ' ' + user?.last_name
  const isOfferScreen = route?.isOfferScreen
  const [bodyText, setBodyText] = useState('')
  const isPreviewOnly = route?.isPreviewOnly
  const [isLoading, setISLoading] = useState(false)
  const [height, setHeight] = useState<null | number>(null)

  const item = route?.item

  useEffect(() => {
    if (isEditable) {
      if (inputRef.current) {
        inputRef.current?.focus()
      }
    }
  }, [isEditable])

  useEffect(() => {
    if (isLoading) {
      setIsEditable(true)
      setTimeout(() => {
        setISLoading(false)
      }, 1000)
    }
  }, [isLoading])

  useEffect(() => {
    const regex = /<\/?body>|<br\s?\/?>/gi

    const fomratedText =
      item?.email_body && typeof item?.email_body === 'string'
        ? item?.email_body
            ?.replace('{{ receiver_name }}', contactItem?.name)
            ?.replace('{{ sender_name }}', username)
            ?.replace(regex, '')
        : ''
    setBodyText(fomratedText)
  }, [contactItem?.name, item?.email_body, username])

  const permiumAlert = useCallback(() => {
    AlertLoader.show(English.R212, [
      {
        title: English.R210,
        style: 'cancel'
      },
      {
        title: English.R209,
        onPress: () => {
          navigation.navigate(Screens.PremiumPlanScreen, {
            initialIndex: 2
          })
        }
      }
    ])
  }, [navigation])

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
      APICall('post', payload, EndPoints.getEmailTemplates)
        .then(async (resp: any) => {
          Loader.isLoading(false)
          if (resp?.status === 200 && resp?.data) {
            await Utility.wait()
            Toast.show('Email sent!')
            navigation.goBack()
          }
        })
        .catch((e) => {
          Utility.showAlert(String(e?.data?.message))
          Loader.isLoading(false)
        })
    }
  }, [
    bodyText,
    item?.email_type,
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
    if (
      plan_details &&
      Number(plan_details?.monthly_send_emails) >= Number(plan_details?.send_offer_limit) &&
      plan_details?.plan_name === Constant.Plans.Free
    ) {
      permiumAlert()
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
            if (plan_details?.plan_name === Constant.Plans.Free) {
              dispatch(
                setPlanData({
                  monthly_send_emails: Number(plan_details?.monthly_send_emails || 0) + 1
                })
              )
            }
          }
        })
        .catch((e) => {
          Utility.showAlert(String(e?.data?.message))
          Loader.isLoading(false)
        })
    }
  }, [contactItem?.cache_id, contactItem?.email, dispatch, navigation, permiumAlert, plan_details])

  const onPressRight = useCallback(() => {
    if (isEditable) {
      Utility.showAlert('Template saved!')
      setIsEditable(false)
    } else {
      setISLoading(true)
    }
  }, [isEditable])

  return (
    <AppContainer>
      <AppHeader
        rightImage={!isOfferScreen && (isEditable ? Images.right : Images.pencil)}
        isBack
        onPressRight={() => !isOfferScreen && onPressRight()}
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
            <AppScrollView
              contentContainerStyle={isLoading ? [CommonStyles.centerItem, CommonStyles.flex] : {}}
              showsVerticalScrollIndicator={false}
              extraScrollHeight={Constant.isIOS ? 0 : 10}
            >
              {!isLoading ? (
                <TextInput
                  editable={isEditable}
                  onChangeText={setBodyText}
                  style={[
                    styles.input,
                    {
                      height: height || styles.input.height
                    }
                  ]}
                  multiline
                  onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                  ref={inputRef}
                  value={bodyText}
                />
              ) : (
                <LoadingView />
              )}
            </AppScrollView>
          </View>
        )
      )}

      {!isPreviewOnly && (
        <Pressable style={styles.sendImageBTN} disabled>
          <BackButton
            onPress={() => {
              if (isOfferScreen) {
                onPressSendContract()
              } else {
                onPressSend()
              }
            }}
            key={'offerScreen'}
            colors={[Colors.ThemeColor, Colors.purpleShadB0]}
            image={Images.send}
            style={styles.sendImage}
            imageStyle={styles.imageStyle}
          />
        </Pressable>
      )}
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
    borderRadius: moderateScale(10)
  },
  sendImageBTN: {
    position: 'absolute',
    zIndex: 1000,
    right: scale(20),
    bottom: 0
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
    textTransform: 'capitalize',
    height: Constant.isIOS ? W_HEIGHT : 'auto'
  }
})
