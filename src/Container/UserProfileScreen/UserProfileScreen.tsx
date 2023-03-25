import React, {useCallback} from 'react'
import {StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import {GettingText} from '../../CommonStyle/AuthContainer'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppProfileImage from '../../Components/AppProfileIcon'
import AppScrollView from '../../Components/AppScrollView'
import English from '../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../Theme'
import {CommonStyles} from '../../Theme/CommonStyles'
import {Fonts} from '../../Theme/Fonts'
import {moderateScale, scale, STATUSBAR_HEIGHT, verticalScale} from '../../Theme/Responsive'
import Utility from '../../Theme/Utility'
import SettingButton from '../SettingScreen/Components/SettingButton'

const UserProfileScreen = () => {
  const navigation: any = useNavigation()

  const onPressEditProfile = useCallback(() => {
    navigation.navigate(Screens.EditProfileScreen)
  }, [navigation])

  const onPressChangePassword = useCallback(() => {
    navigation.navigate(Screens.ChangePasswordScreen)
  }, [navigation])

  const onPressDeleteAccount = useCallback(() => {
    Utility.showToast('Comming Soon')
  }, [])

  return (
    <AppContainer
      statusbarColor={Colors.transparent}
      translucent
      barStyle={'light-content'}
      isTopSafeArea={false}
      style={CommonStyles.flex}
    >
      <AppScrollView bounces={false} style={CommonStyles.flex}>
        <UserImageContainer resizeMode={'cover'} source={Images.userProfileback} />
        <AppHeader
          isBack
          style={styles.headerStyle}
          title={English.R131}
          headerTextStyle={styles.headerTextStyle}
          colors={[Colors.white, Colors.white]}
        />
        <AppProfileImage
          borderRadius={30}
          size={100}
          style={styles.profileImage}
          borderColor={Colors.white}
          borderWidth={4}
          url={'https://i.ibb.co/znvXjTV/untitled.png'}
        />

        <RoundView>
          <EditContainer onPress={onPressEditProfile}>
            <GettingText marginBottom={1}>{'William Smith'}</GettingText>
            <PencilIcon source={Images.pencil} />
          </EditContainer>

          <LabeledText color={Colors.greyShadeUnk}>{English.R132}</LabeledText>
          <LabelView>
            <LabeledText>{English.R133}</LabeledText>
            <LabeledText color={Colors.greyShade595}>{'1 (800) 315-0190'}</LabeledText>
          </LabelView>
          <LabelView>
            <LabeledText>{English.R134}</LabeledText>
            <LabeledText color={Colors.greyShade595}>{'smithnwill@projectile.com'}</LabeledText>
          </LabelView>

          <LabeledText color={Colors.greyShadeUnk}>{English.R135}</LabeledText>
          <LabelView>
            <LabeledText>{English.R135}</LabeledText>
            <LabeledText color={Colors.greyShade595}>{'Devid Biden'}</LabeledText>
          </LabelView>
          <LabelView>
            <LabeledText>{English.R136}</LabeledText>
            <LabeledText color={Colors.greyShade595}>
              {'123 Jodn Street,Near Cafe shop'}
            </LabeledText>
          </LabelView>
          <LabelView>
            <LabeledText>{English.R137}</LabeledText>
            <LabeledText color={Colors.greyShade595}>{'23ET12CDSE'}</LabeledText>
          </LabelView>
          <LabelView>
            <LabeledText>{English.R138}</LabeledText>
            <LabeledText color={Colors.greyShade595}>{'23ET12CDSE'}</LabeledText>
          </LabelView>
          <LabelView>
            <LabeledText>{English.R139}</LabeledText>
            <LabeledText color={Colors.greyShade595}>{'San Francisco'}</LabeledText>
          </LabelView>
          <SettingButton
            isMarginLeft={false}
            color={Colors.ThemeColor}
            isArrow
            onPress={onPressChangePassword}
            title={English.R142}
          />
          <AppButton
            onPress={onPressDeleteAccount}
            textStyle={styles.textStyle}
            style={styles.buttonStyle}
            isGradient={false}
            title={English.R143}
          />
        </RoundView>
      </AppScrollView>
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
    top: verticalScale(180),
    zIndex: 1000
  },
  headerTextStyle: {
    color: Colors.white
  },
  buttonStyle: {
    backgroundColor: Colors.redShade,
    marginTop: verticalScale(30)
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
  width: 40%;
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
