import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Keyboard, Platform, TextInput, View} from 'react-native'
import {useDispatch} from 'react-redux'
import {appleAuth} from '@invertase/react-native-apple-authentication'
import {CommonActions, useNavigation} from '@react-navigation/native'
import jwt_decode from 'jwt-decode'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppAlertModal from '../../../Components/AppAlertModal'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppInput from '../../../Components/AppInput'
import AppLogo from '../../../Components/AppLogo'
import AppScrollView from '../../../Components/AppScrollView'
import Loader from '../../../Components/Loader'
import TouchText from '../../../Components/TouchText'
import {setUserData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Colors, Constant, Images, Screens} from '../../../Theme'
import {
  CommonStyles,
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../../Theme/CommonStyles'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'

const LoginScreen = () => {
  const navigation: any = useNavigation()
  const passwordRef = useRef<TextInput>(null)
  const [email, setEmail] = useState(Constant.isDebug ? 'free@yopmail.com' : '')
  const [password, setPassword] = useState(Constant.isDebug ? '12345678' : '')
  const [isEnabled, setISEnabled] = useState(false)
  const [submitPressed, setSubmitPressed] = useState(false)
  const [errEmail, setErrEmail] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const dispatch = useDispatch()
  const [isModal, setISModal] = useState(false)

  useEffect(() => {
    setISEnabled(!!(Utility.isEmpty(email) && Utility.isEmpty(password)))
  }, [email, password])

  const onChangeEmail = (text: string) => {
    let errorMessage = ''
    if (submitPressed) {
      if (Utility.isValid(text)) {
        errorMessage = English.R163
      }
    }
    setEmail(text)
    setErrEmail(errorMessage)
  }
  const onChangePassword = (text: string) => {
    let errorMessage = ''
    if (submitPressed) {
      if (!Utility.validatePassword(text)) {
        errorMessage = English.R165
      }
    }
    setPassword(text)
    setErrPassword(errorMessage)
  }

  const onPressForgotPassword = useCallback(() => {
    navigation.navigate(Screens.ForgotPassScreen)
  }, [navigation])

  const onPressRegister = useCallback(
    (isGoogle: any = false, isApple = false, isSocialLogin: any) => {
      navigation.navigate(Screens.RegisterScreen, {
        isGoogle: isGoogle || null,
        isApple,
        isSocialLogin
      })
    },
    [navigation]
  )

  const onLoginSetup = useCallback(
    (resp: any) => {
      Constant.token = resp?.data?.token
      Constant.refresh = resp?.data?.refresh_token
      const cloneData = Utility.deepClone(resp?.data?.data)
      cloneData.token = resp?.data?.token
      cloneData.refresh_token = resp?.data?.refresh_token

      dispatch(setUserData(cloneData))

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.Drawer,
              params: {
                isLogOut: true
              }
            }
          ]
        })
      )
    },
    [dispatch, navigation]
  )

  const onPressGoogleLogin = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    const googleUser: any = await Utility.googleLogin()

    if (googleUser) {
      const payload = {
        google_access_token: googleUser?.token?.accessToken,
        email: googleUser?.user?.email,
        profile_image: googleUser?.user?.photo
      }

      Loader.isLoading(true)
      Utility.googleAPILogin(payload)
        .then(async (resp: any) => {
          Loader.isLoading(false, () => {
            Utility.wait(500).then(async () => {
              if (resp?.status === 200 && resp?.data?.data && !resp?.data?.is_new_user) {
                onLoginSetup(resp)
              } else if (resp?.status === 201 && resp?.data?.is_new_user) {
                onPressRegister(googleUser?.user, false, {...payload, isGoogle: true})
              } else if (resp?.status === 202) {
                navigation.navigate(Screens.VerificationScreen, {
                  isRegister: true,
                  email: googleUser?.user?.email,
                  isSocialLogin: {...payload, isGoogle: true}
                })
              } else if (resp?.status === 404) {
                setISModal(true)
              } else {
                await Utility.wait(300)
                Utility.showAlert(resp?.data?.message)
              }
            })
          })
        })
        .catch((e) => {
          Utility.showAlert(String(e?.data?.message))
          Loader.isLoading(false)
        })
    }
  }, [navigation, onLoginSetup, onPressRegister])

  const onPressAppleLogin = useCallback(async () => {
    try {
      const isInternet = await Utility.isInternet()
      if (!isInternet) {
        return
      }
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      })
      const {email}: any = jwt_decode(appleAuthRequestResponse.identityToken || '')
      if (appleAuthRequestResponse?.identityToken) {
        const payload = {
          apple_access_token: appleAuthRequestResponse.identityToken,
          email
        }

        Loader.isLoading(true)
        Utility.appleAPILogin(payload)
          .then(async (resp: any) => {
            Loader.isLoading(false, () => {
              Utility.wait(500).then(async () => {
                if (resp?.status === 200 && resp?.data?.data && !resp?.data?.is_new_user) {
                  onLoginSetup(resp)
                } else if (resp?.status === 201 && resp?.data?.is_new_user) {
                  onPressRegister({email}, true, {...payload, isApple: true})
                } else if (resp?.status === 202) {
                  navigation.navigate(Screens.VerificationScreen, {
                    isRegister: true,
                    email,
                    isSocialLogin: {...payload, isApple: true}
                  })
                } else if (resp?.status === 404) {
                  setISModal(true)
                } else {
                  Utility.showAlert(resp?.data?.message)
                }
              })
            })
          })
          .catch((e) => {
            Utility.showAlert(String(e?.data?.message))
            Loader.isLoading(false)
          })
      }
    } catch (error) {}
  }, [navigation, onLoginSetup, onPressRegister])

  const onPressLogin = useCallback(async () => {
    Keyboard.dismiss()
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    let isValid = true
    setSubmitPressed(true)
    if (Utility.isValid(email)) {
      setErrEmail(English.R163)
      isValid = false
    }
    if (!Utility.validatePassword(password)) {
      setErrPassword(English.R165)
      isValid = false
    }

    if (isValid) {
      Loader.isLoading(true)

      const payload = {
        email,
        password
      }

      APICall('post', payload, EndPoints.login)
        .then(async (resp: any) => {
          Loader.isLoading(false, () => {
            Utility.wait(500).then(() => {
              if (resp?.status === 200 && resp?.data?.data) {
                onLoginSetup(resp)
              } else if (resp?.status === 202) {
                navigation.navigate(Screens.VerificationScreen, {
                  isRegister: true,
                  email
                })
              } else if (resp?.status === 404) {
                setISModal(true)
              } else {
                Utility.showAlert(resp?.data?.message)
              }
            })
          })
        })
        .catch((e) => {
          Utility.showAlert(String(e?.data?.message))
          Loader.isLoading(false)
        })
    }
  }, [email, navigation, onLoginSetup, password])

  const forgotPassStyle: any = {
    alignSelf: 'flex-end'
  }

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <AppLogo />

          <GettingText isTopMargin top={20}>
            {English.R15}
          </GettingText>
          <CreateAnAccountText marginBottom={20}>{English.R16}</CreateAnAccountText>
          <AppInput
            onSubmitEditing={() => passwordRef.current?.focus()}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R17}
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={email}
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            onChangeText={(text: string) => onChangeEmail(text)}
            error={errEmail}
          />
          <AppInput
            returnKeyType={'done'}
            ref={passwordRef}
            value={password}
            isPassword
            isEye
            autoComplete={'off'}
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            onChangeText={(text: string) => onChangePassword(text)}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R18}
            error={errPassword}
          />
          <TouchText
            marginTop={verticalScale(20)}
            marginBottom={verticalScale(20)}
            text={English.R31}
            style={forgotPassStyle}
            onPress={onPressForgotPassword}
          />
          <AppButton
            disabled={!isEnabled}
            style={styles.inputStyle}
            onPress={onPressLogin}
            title={English.R19}
          />
          <AppButton
            style={styles.googleFullContainer}
            textStyle={styles.textStyle}
            leftImage={Images.google}
            title={English.R96}
            isGradient={false}
            onPress={onPressGoogleLogin}
          />

          {Platform.OS === 'ios' && Number(Platform.Version) > 13 && (
            <AppButton
              style={styles.googleFullContainer}
              textStyle={styles.textStyle}
              leftImage={Images.apple}
              title={English.R12}
              isGradient={false}
              onPress={onPressAppleLogin}
            />
          )}

          <View style={CommonStyles.onlyRow}>
            <TouchText
              marginTop={verticalScale(30)}
              color={Colors.blackShade2A30}
              marginBottom={0}
              textAlign={'center'}
              text={English.R29}
            />
            <TouchText
              marginTop={verticalScale(30)}
              marginBottom={0}
              textAlign={'center'}
              text={English.R30}
              onPress={() => onPressRegister(false, false, null)}
            />
          </View>
        </AppScrollView>
      </ScrollContainer>
      <AppAlertModal
        isVisible={isModal}
        middleText={English.R46}
        topText={English.R87}
        btnText={English.R86}
        image={Images.image404}
        onPress={() => {}}
        onClose={() => setISModal(false)}
      />
    </AppContainer>
  )
}

export default LoginScreen
