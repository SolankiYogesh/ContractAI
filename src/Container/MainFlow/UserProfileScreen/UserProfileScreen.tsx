import React, {useCallback, useEffect, useState} from 'react'
import {Alert, StyleSheet} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import {useDispatch, useSelector} from 'react-redux'
import {CommonActions, useNavigation} from '@react-navigation/native'
import Skeleton from '@thevsstech/react-native-skeleton'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import {GettingText} from '../../../CommonStyle/AuthContainer'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppProfileImage from '../../../Components/AppProfileIcon'
import Loader from '../../../Components/Loader'
import {logOut, setUserData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
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

  const setupData = useCallback(() => {
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
      .catch(() => {
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

  const onPressDeleteAccount = useCallback(() => {
    const payload = {
      disable_account: true
    }
    APICall('post', payload, EndPoints.deleteAccount).then((resp: any) => {
      Loader.isLoading(false)

      Utility.showAlert(resp?.data?.message)
      if (resp?.status === 200) {
        onLogOut()
      }
    })
  }, [onLogOut])

  const onPressDelete = useCallback(() => {
    Alert.alert(
      'Warning',
      'Are you sure that you want to delete your account ?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {text: 'OK', onPress: () => onPressDeleteAccount()}
      ],
      {userInterfaceStyle: 'light'}
    )
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
    (children: React.ReactNode) => {
      return isLoading ? (
        <Skeleton>
          <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
          <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
        </Skeleton>
      ) : (
        children
      )
    },
    [isLoading]
  )

  return (
    <AppContainer
      statusbarColor={Colors.transparent}
      translucent
      barStyle={'light-content'}
      isTopSafeArea={false}
      style={CommonStyles.flex}
    >
      <ParallaxScrollView
        parallaxHeaderHeight={verticalScale(300)}
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
        <AppProfileImage
          borderRadius={30}
          size={100}
          style={styles.profileImage}
          isLoading={isLoading}
          borderColor={Colors.white}
          borderWidth={4}
          url={user?.profile_image}
        />
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
                {(!!user?.first_name || !!user?.last_name) && <PencilIcon source={Images.pencil} />}
              </>
            )}
          </EditContainer>
          {isLoading ? (
            <Skeleton>
              <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
            </Skeleton>
          ) : (
            <LabeledText color={Colors.greyShadeUnk}>{English.R132}</LabeledText>
          )}

          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R133}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {'+1 ' + (Utility.formateNumber(user?.phone_number) || '-')}
                </LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R134}</LabeledText>
                <LabeledText color={Colors.greyShade595}>{user?.email || '-'}</LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R168}</LabeledText>
                <LabeledText color={Colors.greyShade595}>{user?.license_no || '-'}</LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R174}</LabeledText>
                <LabeledText color={Colors.greyShade595}>{user?.address || '-'}</LabeledText>
              </>
            )}
          </LabelView>

          {isLoading ? (
            <Skeleton>
              <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
            </Skeleton>
          ) : (
            <LabeledText color={Colors.greyShadeUnk}>{English.R150}</LabeledText>
          )}

          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R136}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.broker_name || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>

          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R137}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.broker_address || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R138}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.broker_license_no || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R175}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.supervisor_name || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R176}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.supervisor_license_no || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R180}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.title_company || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>
          <LabelView>
            {renderDataView(
              <>
                <LabeledText>{English.R178}</LabeledText>
                <LabeledText color={Colors.greyShade595}>
                  {user?.broker?.title_company_address || '-'}
                </LabeledText>
              </>
            )}
          </LabelView>
          <SettingButton
            isMarginLeft={false}
            color={Colors.ThemeColor}
            isArrow
            isMargin
            fontSize={16}
            onPress={onPressChangePassword}
            title={English.R142}
          />
          <AppButton
            onPress={onPressDelete}
            textStyle={styles.textStyle}
            style={styles.buttonStyle}
            isGradient={false}
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
    width: '100%',
    top: STATUSBAR_HEIGHT
  },
  profileImage: {
    alignSelf: 'center',
    position: 'absolute',
    top: -verticalScale(70),
    zIndex: 1000,
    backgroundColor: Colors.white
  },
  headerTextStyle: {
    color: Colors.white
  },
  buttonStyle: {
    backgroundColor: Colors.redShade,
    marginTop: verticalScale(30),
    width: '90%'
  },

  textStyle: {
    color: Colors.white
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
  border-radius: ${moderateScale(25)}px;
  padding: ${scale(10)}px;
  overflow: hidden;
  top: -${verticalScale(20)}px;
  background-color: ${Colors.white};
  padding-top: ${verticalScale(50)}px;
`
export const LabeledText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: ${moderateScale(16)}px;
  color: ${(props: any) => props?.color || Colors.blackShade2A30};
  width: 45%;
`

const LabelView = styled.View`
  flex: 1;
  margin-left: ${scale(10)}px;
  margin-right: ${scale(10)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${verticalScale(15)}px;
  margin-bottom: ${verticalScale(15)}px;
`
const PencilIcon = styled.Image`
  width: ${verticalScale(25)}px;
  height: ${verticalScale(25)}px;
  margin-left: ${scale(10)}px;
  tint-color: ${Colors.black};
`
