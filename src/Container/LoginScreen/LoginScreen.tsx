import React, {useCallback, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import {
  AlreadyAccountText,
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../CommonStyle/AuthContainer'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppInput from '../../Components/AppInput'
import AppScrollView from '../../Components/AppScrollView'
import English from '../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../Theme'
import {Fonts} from '../../Theme/Fonts'
import {moderateScale, verticalScale} from '../../Theme/Responsive'
import Utility from '../../Theme/Utility'

const LoginScreen = () => {
  const navigation: any = useNavigation()
  const passwordRef = useRef<TextInput>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onPressForgotPassword = useCallback(() => {
    navigation.navigate(Screens.ForgotPassScreen)
  }, [navigation])

  const onPressGoogleLogin = useCallback(() => {
    Utility.showToast('You are going to login with google')
    navigation.navigate(Screens.Drawer)
  }, [navigation])

  const onPressRegister = useCallback(() => {
    navigation.navigate(Screens.RegisterScreen)
  }, [])

  const onPressLogin = useCallback(() => {
    if (!Utility.isEmpty(email)) {
      Utility.showToast(English.R47)
      return
    }
    if (Utility.isValid(email)) {
      Utility.showToast(English.R51)
      return
    }
    if (!Utility.isEmpty(password)) {
      Utility.showToast(English.R48)
      return
    }

    navigation.navigate(Screens.Drawer)
  }, [email, password])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <GettingText isTopMargin>{English.R15}</GettingText>
          <CreateAnAccountText>{English.R16}</CreateAnAccountText>
          <AppInput
            onSubmitEditing={() => passwordRef.current?.focus()}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R17}
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={email}
            onChangeText={setEmail}
          />
          <AppInput
            returnKeyType={'done'}
            ref={passwordRef}
            value={password}
            isPassword
            isEye
            onChangeText={setPassword}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R18}
          />
          <ForgotPasswordText onPress={onPressForgotPassword}>{English.R31}</ForgotPasswordText>
          <AppButton style={styles.inputStyle} onPress={onPressLogin} title={English.R19} />
          <CreateAnAccountText isCenter>{English.R20}</CreateAnAccountText>

          <AppButton
            style={styles.googleFullContainer}
            textStyle={styles.textStyle}
            leftImage={Images.google}
            title={English.R96}
            isGradient={false}
            onPress={onPressGoogleLogin}
          />

          <AlreadyAccountText>
            {English.R29}
            <AlreadyAccountText isClickable onPress={onPressRegister}>
              {English.R30}
            </AlreadyAccountText>
          </AlreadyAccountText>
        </AppScrollView>
      </ScrollContainer>
    </AppContainer>
  )
}

export default LoginScreen
const ForgotPasswordText = styled.Text`
  text-align: right;
  margin-top: ${verticalScale(5)}px;
  margin-bottom: ${verticalScale(5)}px;
  color: ${Colors.ThemeColor};
  font-size: ${moderateScale(14)}px;
  font-family: ${Fonts.ThemeMedium};
`
