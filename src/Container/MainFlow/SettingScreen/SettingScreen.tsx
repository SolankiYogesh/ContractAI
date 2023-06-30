import React, {useCallback, useMemo} from 'react'
import {Image, Platform, View} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import InAppReview from 'react-native-in-app-review'
import Share from 'react-native-share'
import {useDispatch, useSelector} from 'react-redux'
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AlertLoader from '../../../Components/AlertLoader'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppProfileIcon from '../../../Components/AppProfileIcon'
import Loader from '../../../Components/Loader'
import TouchText from '../../../Components/TouchText'
import {logOut} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Images, Screens} from '../../../Theme'
import {CommonStyles, CreateAnAccountText, GettingText} from '../../../Theme/CommonStyles'
import {scale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import SettingButton from './Components/SettingButton'

const SettingScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state?.user?.userData)

  const onPressLogOut = useCallback(() => {
    Utility.destroyVoice()
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: Screens.AuthKey,
            params: {
              isLogOut: true
            }
          }
        ]
      })
    )
    dispatch(logOut())
  }, [dispatch, navigation])

  const onPressShare = useCallback(async () => {
    await Share.open({
      message:
        "Let's try Reeva app! It's a smart and easy app for real estate agents to create contracts in minutes. It's fast, simple and secure way to draft contracts that meet your needs and preferences. Get it at",
      url: Platform.OS === 'android' ? EndPoints.playStore : EndPoints.appleStore,
      title: 'Share with friend'
    })
  }, [])

  const onPressReport = useCallback(() => {
    navigation.navigate(Screens.FeedbackScreen)
  }, [navigation])

  const onPressLogOutButton = useCallback(() => {
    AlertLoader.show(English.R213, [
      {
        title: English.R207,
        style: 'cancel'
      },
      {
        title: English.R210,
        onPress: onPressLogOut
      }
    ])
  }, [onPressLogOut])

  const onPressButton = useCallback(() => {
    navigation.navigate(Screens.UserProfileScreen)
  }, [navigation])

  const onPressRating = useCallback(async () => {
    const isAvailable = InAppReview.isAvailable()

    if (isAvailable) {
      await InAppReview.RequestInAppReview()
    } else {
      Utility.showAlert(English.R187)
    }
  }, [])

  const onPressButtonBrokerRage = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    const payload = {
      request_brokerage: true
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.requestBrokerage)
      .then((resp: any) => {
        Loader.isLoading(false)

        if (resp?.status === 200) {
          Utility.showAlert(English.R186)
        } else {
          Utility.showAlert(resp?.data?.message)
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        Loader.isLoading(false)
      })
  }, [])

  const renderProfileView = useMemo(() => {
    return (
      <ProfileContainer onPress={onPressButton}>
        <AppProfileIcon borderWidth={0} url={user?.profile_image} />
        <NameContainer>
          {
            <GettingText marginBottom={1}>
              {user?.first_name || user?.last_name ? user?.first_name + ' ' + user?.last_name : '-'}
            </GettingText>
          }
          <CreateAnAccountText marginBottom={1}>{user?.email}</CreateAnAccountText>
        </NameContainer>
        <Image source={Images.right_arrow} />
      </ProfileContainer>
    )
  }, [onPressButton, user?.email, user?.first_name, user?.last_name, user?.profile_image])

  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R123} />
      {renderProfileView}
      <View style={CommonStyles.flex}>
        <SettingButton onPress={onPressRating} image={Images.start} title={English.R125} />

        <SettingButton onPress={onPressShare} image={Images.share} title={English.R126} />
        <SettingButton onPress={onPressReport} isArrow image={Images.about} title={English.R127} />
        <SettingButton
          onPress={onPressButtonBrokerRage}
          image={Images.brokerage}
          title={English.R128}
        />
      </View>
      <SettingButton onPress={onPressLogOutButton} image={Images.log_out2} title={English.R129} />
      <TouchText
        marginTop={verticalScale(30)}
        marginBottom={verticalScale(30)}
        textAlign={'center'}
        text={English.R130 + DeviceInfo.getVersion()}
      />
    </AppContainer>
  )
}

export default SettingScreen

const ProfileContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: ${verticalScale(30)}px;
  margin-bottom: ${verticalScale(30)}px;
  margin-left: ${scale(20)}px;
  margin-right: ${scale(20)}px;
`
const NameContainer = styled.View`
  margin-left: ${scale(10)}px;
  flex: 1;
  justify-content: center;
`
