import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import {useDispatch, useSelector} from 'react-redux'
import {CommonActions, useNavigation} from '@react-navigation/native'
import Skeleton from '@thevsstech/react-native-skeleton'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AlertLoader from '../../../Components/AlertLoader'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppProfileImage from '../../../Components/AppProfileIcon'
import Loader from '../../../Components/Loader'
import {logOut, setUserData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles, GettingText} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {
  moderateScale,
  scale,
  STATUSBAR_HEIGHT,
  verticalScale,
  widthPx
} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import SettingButton from '../SettingScreen/Components/SettingButton'

const UserProfileScreen = () => {
  const navigation: any = useNavigation()
  const [isLoading, setISLoading] = useState(true)
  const dispatch = useDispatch()
  const HEADER_HEIGHT = verticalScale(100)
  const user = useSelector((state: any) => state?.user?.userData)

  const setupData = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    setISLoading(true)
    APICall('get', {}, EndPoints.editProfile)
      .then((resp: any) => {
        setISLoading(false)
        if (resp?.status === 200) {
          dispatch(setUserData(resp?.data?.data))
        } else {
          Utility.showAlert(resp?.data?.message)
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        setISLoading(false)
      })
  }, [dispatch])

  useEffect(() => {
    setupData()
  }, [setupData])

  const onPressEditProfile = useCallback(() => {
    navigation.navigate(Screens.EditProfileScreen, {
      userData: user
    })
  }, [navigation, user])

  const onPressChangePassword = useCallback(() => {
    navigation.navigate(Screens.ChangePasswordScreen)
  }, [navigation])

  const onLogOut = useCallback(() => {
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

  const onPressDeleteAccount = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    const payload = {
      disable_account: true
    }
    APICall('post', payload, EndPoints.deleteAccount)
      .then((resp: any) => {
        Loader.isLoading(false)

        Utility.showAlert(resp?.data?.message)
        if (resp?.status === 200) {
          onLogOut()
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        Loader.isLoading(false)
      })
  }, [onLogOut])

  const onPressDelete = useCallback(() => {
    AlertLoader.show(English.R214, [
      {
        title: English.R207,
        style: 'cancel'
      },
      {
        title: English.R210,
        onPress: onPressDeleteAccount
      }
    ])
  }, [onPressDeleteAccount])

  const renderNavBar = () => (
    <AppHeader
      isBack
      style={styles.headerStyle}
      title={English.R131}
      headerTextStyle={styles.headerTextStyle}
      colors={[Colors.white, Colors.white]}
    />
  )

  const renderDataView = useCallback(
    (label: string, value: string) => {
      return isLoading ? (
        <Skeleton
          marginLeft={scale(20)}
          marginRight={scale(20)}
          marginTop={scale(10)}
          marginBottom={scale(10)}
        >
          <Skeleton.Item
            marginLeft={scale(20)}
            marginRight={scale(20)}
            height={verticalScale(25)}
            borderRadius={4}
            marginTop={scale(10)}
          />
          <Skeleton.Item
            marginLeft={scale(20)}
            marginRight={scale(20)}
            height={verticalScale(25)}
            borderRadius={4}
            marginTop={scale(10)}
          />
        </Skeleton>
      ) : (
        <>
          <LabelView>
            <LabeledText fontSize={13} color={Colors.greyShadeB1B5} isLeft>
              {label}
            </LabeledText>
            <LabeledText color={Colors.greyShade595}>{value}</LabeledText>
            {!isLoading && <View style={styles.devider} />}
          </LabelView>
        </>
      )
    },
    [isLoading]
  )

  const renderLabelView = useCallback(
    (label: string) => {
      return isLoading ? (
        <Skeleton>
          <Skeleton.Item
            marginTop={verticalScale(25)}
            marginLeft={verticalScale(10)}
            width={widthPx(30)}
            height={verticalScale(25)}
            borderRadius={4}
          />
        </Skeleton>
      ) : (
        <LabeledText left={10} top={25} fontSize={14} color={Colors.greyShade263}>
          {label}
        </LabeledText>
      )
    },
    [isLoading]
  )

  const renderProfileImage = useMemo(() => {
    return (
      <AppProfileImage
        borderRadius={30}
        size={100}
        style={styles.profileImage}
        isLoading={isLoading}
        borderWidth={0}
        url={!isLoading && user?.profile_image}
      />
    )
  }, [isLoading, user?.profile_image])

  return (
    <AppContainer
      statusbarColor={Colors.transparent}
      translucent
      barStyle={'light-content'}
      isTopSafeArea={false}
      style={CommonStyles.flex}
    >
      <ParallaxScrollView
        parallaxHeaderHeight={verticalScale(200)}
        stickyHeaderHeight={HEADER_HEIGHT}
        bounces={false}
        showsVerticalScrollIndicator={false}
        backgroundColor={Colors.ThemeColor}
        renderForeground={() => (
          <UserImageContainer resizeMode={'cover'} source={Images.userProfileback} />
        )}
        renderBackground={() => (
          <UserImageContainer resizeMode={'cover'} source={Images.userProfileback} />
        )}
        renderFixedHeader={renderNavBar}
        renderStickyHeader={() => <></>}
      >
        {renderProfileImage}
        <RoundView>
          <EditContainer disabled={isLoading} onPress={onPressEditProfile}>
            {isLoading ? (
              <Skeleton>
                <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
              </Skeleton>
            ) : (
              <>
                <GettingText marginBottom={1}>
                  {!!user?.first_name || !!user?.last_name
                    ? user?.first_name + ' ' + user?.last_name
                    : '-'}
                </GettingText>
                {(!!user?.first_name || !!user?.last_name) && (
                  <PencilIcon tintColor={Colors.black} source={Images.pencil} />
                )}
              </>
            )}
          </EditContainer>

          {renderLabelView(English.R132)}

          {renderDataView(English.R133, '+1 ' + (Utility.formateNumber(user?.phone_number) || '-'))}
          {renderDataView(English.R134, user?.email || '-')}
          {renderDataView(English.R168, user?.license_no || '-')}
          {renderDataView(English.R174, user?.address || '-')}

          {renderLabelView(English.R150)}

          {renderDataView(English.R136, user?.broker?.broker_name || '-')}
          {renderDataView(English.R137, user?.broker?.broker_address || '-')}
          {renderDataView(English.R138, user?.broker?.broker_license_no || '-')}
          {renderDataView(English.R175, user?.broker?.supervisor_name || '-')}
          {renderDataView(English.R176, user?.broker?.supervisor_license_no || '-')}
          {renderDataView(English.R180, user?.broker?.title_company || '-')}
          {renderDataView(English.R178, user?.broker?.title_company_address || '-')}

          <SettingButton
            isMarginLeft={false}
            color={Colors.ThemeColor}
            isArrow
            marginVertical={100}
            isMargin
            style={styles.settingStyle}
            fontSize={16}
            imageStyle={styles.imageStyle}
            onPress={onPressChangePassword}
            title={English.R142}
          />
          <AppButton
            onPress={onPressDelete}
            textStyle={styles.textStyle}
            style={styles.buttonStyle}
            isGradient={false}
            leftImageStyle={styles.leftImageStyle}
            leftImage={Images.trash}
            title={English.R143}
          />
        </RoundView>
      </ParallaxScrollView>
    </AppContainer>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({
  headerStyle: {
    position: 'absolute',
    zIndex: 1000,
    width: '85%',
    top: STATUSBAR_HEIGHT,
    marginLeft: 0,
    alignSelf: 'center'
  },
  profileImage: {
    alignSelf: 'center',
    position: 'absolute',
    top: -verticalScale(75),
    zIndex: 1000,
    backgroundColor: Colors.white
  },
  headerTextStyle: {
    color: Colors.white
  },
  buttonStyle: {
    marginTop: verticalScale(30),
    width: '85%',
    backgroundColor: Colors.white,
    borderColor: Colors.redShade,
    borderWidth: 1
  },

  textStyle: {
    color: Colors.redShade
  },
  leftImageStyle: {
    tintColor: Colors.redShade
  },
  devider: {
    borderWidth: 1,
    borderColor: Colors.greyShadeEBEB,
    borderStyle: 'solid',
    marginVertical: verticalScale(15)
  },
  imageStyle: {
    marginRight: scale(10)
  },
  settingStyle: {
    width: '90%',
    alignSelf: 'center'
  }
})

const EditContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-self: center;
  align-items: center;
  margin-top: ${verticalScale(15)}px;
  margin-bottom: ${verticalScale(15)}px;
`

const UserImageContainer = styled.Image`
  width: 100%;
  height: ${verticalScale(250)}px;
`
const RoundView = styled.View`
  flex: 1;
  overflow: hidden;
  top: -${verticalScale(20)}px;
  background-color: ${Colors.white};
  padding-top: ${verticalScale(50)}px;
  padding-bottom: ${verticalScale(10)}px;
`
export const LabeledText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: ${(props: any) =>
    props?.fontSize ? moderateScale(props?.fontSize) : moderateScale(16)}px;
  color: ${(props: any) => props?.color || Colors.blackShade2A30};
  margin-top: ${(props: any) => (props?.top ? verticalScale(props?.top) : verticalScale(5))}px;
  margin-left: ${(props: any) => (props?.left ? scale(props?.left) : 0)}px;
  margin-right: ${(props: any) => (props?.left ? scale(props?.left) : 0)}px;
  margin-bottom: ${(props: any) => (props?.top ? verticalScale(props?.top) : verticalScale(5))}px;
`

const LabelView = styled.View`
  flex: 1;
  width: 85%;
  align-self: center;
`
const PencilIcon = styled.Image`
  margin-left: ${scale(10)}px;
`
