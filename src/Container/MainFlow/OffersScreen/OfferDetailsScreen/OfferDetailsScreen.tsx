import React, {useCallback} from 'react'
import {StyleSheet, View} from 'react-native'
import WebView from 'react-native-webview'
import {useSelector} from 'react-redux'
import {useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import APICall from '../../../../APIRequest/APICall'
import AppConfig from '../../../../APIRequest/AppConfig'
import EndPoints from '../../../../APIRequest/EndPoints'
import AppContainer from '../../../../Components/AppContainer'
import AppHeader from '../../../../Components/AppHeader'
import AppScrollView from '../../../../Components/AppScrollView'
import BackButton from '../../../../Components/BackButton'
import Loader from '../../../../Components/Loader'
import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'

const OfferDetailsScreen = () => {
  const navigation = useNavigation()
  const route: any = useRoute().params
  const contactItem = route?.contactItem
  const regex = /<\/?body>/gi
  const user: any = useSelector((state: any) => state?.user?.userData)
  const username = user?.first_name + ' ' + user?.last_name
  const isOfferScreen = route?.isOfferScreen

  const item = route?.item
  const bodyText =
    item?.email_body && typeof item?.email_body === 'string'
      ? item?.email_body
          ?.replace('[receiver_name]', contactItem?.name)
          ?.replace('[sender_name]', username)
          ?.replace(regex, '')
      : ''

  const onPressSend = useCallback(() => {
    const regex = /<body>([\s\S]*?)<\/body>/i
    const match = item?.email_body?.match(regex)
    const bodyContent = match ? match[1].trim() : ''
    if (bodyContent) {
      const payload = {
        email_type: item?.email_type,
        email_body: bodyContent,
        to_email: contactItem?.email,
        receiver_name: contactItem?.name,
        from_email: user?.email,
        sender_name: username
      }
      Loader.isLoading(true)
      APICall('get', payload, EndPoints.getEmailTemplates)
        .then((resp: any) => {
          Loader.isLoading(false)

          if (resp?.status === 200 && resp?.data) {
            setTimeout(() => {
              Utility.showAlert('Email send!')
            }, 1000)
            navigation.goBack()
          }
        })
        .catch(() => {
          Loader.isLoading(false)
        })
    }
  }, [contactItem, user, username, item, navigation])

  return (
    <AppContainer>
      <AppHeader isBack title={item?.email_type || English.R158} />

      {isOfferScreen ? (
        <WebView
          source={{
            uri: AppConfig.API_URL + contactItem?.filled_form
          }}
          onLoadStart={() => Loader.isLoading(true)}
          onLoad={() => Loader.isLoading(false)}
          scalesPageToFit
          scrollEnabled
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          overScrollMode={'never'}
          style={CommonStyles.flex}
        />
      ) : (
        <View style={styles.container}>
          <AppScrollView>
            <TemplateText>{bodyText}</TemplateText>
          </AppScrollView>
        </View>
      )}

      <BackButton
        onPress={onPressSend}
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
  }
})

const TemplateText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: ${moderateScale(14)}px;
  color: ${Colors.black121928};
  align-items: center;
  line-height: ${verticalScale(25)}px;
  text-align: justify;
  letter-spacing: 1px;
  text-transform: capitalize;
`
