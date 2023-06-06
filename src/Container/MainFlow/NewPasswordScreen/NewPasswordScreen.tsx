import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import {
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../../CommonStyle/AuthContainer'
import AppAlertModal from '../../../Components/AppAlertModal'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import BackButton from '../../../Components/BackButton'
import ErrorText from '../../../Components/ErrorText'
import Loader from '../../../Components/Loader'
import English from '../../../Resources/Locales/English'
import {Images, Screens} from '../../../Theme'
import Utility from '../../../Theme/Utility'

const NewPasswordScreen = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isModal, setISModal] = useState(false)
  const navigation: any = useNavigation()
  const [isEnabled, setISEnabled] = useState(false)
  const [isPasswordError, setISPasswordError] = useState(false)
  const route: any = useRoute()?.params

  const email = route?.email
  const tokenData: any = route?.data
  const confirmPasswordRef = useRef<TextInput>(null)

  useEffect(() => {
    setISEnabled(!!(Utility.isEmpty(confirmPassword) && Utility.isEmpty(password)))
  }, [confirmPassword, password])

  const onPressChangePassword = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    const isMatching = password === confirmPassword
    setISPasswordError(!isMatching)
    if (!isMatching) {
      return
    }
    const payload = {
      email,
      password
    }
    const header: any = {
      Authorization: 'Bearer ' + tokenData?.token
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.resetpassword, header)
      .then(async (resp: any) => {
        Loader.isLoading(false)

        if (resp?.status === 200) {
          await Utility.wait()
          setISModal(true)
        } else {
          Utility.showAlert(resp?.data?.message)
        }
      })
      .catch(() => Loader.isLoading(false))
  }, [password, confirmPassword, email, tokenData])

  const renderChangePasswordView = useMemo(() => {
    return (
      <>
        <AppInput
          value={password}
          onChangeText={setPassword}
          isPassword
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          autoComplete={'off'}
          returnKeyType={'next'}
          ContainerStyle={styles.inputStyle}
          placeholder={English.R44}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        {isPasswordError && <ErrorText errorText={English.R52} />}
        <AppInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          ref={confirmPasswordRef}
          isPassword
          autoComplete={'off'}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          returnKeyType={'done'}
          ContainerStyle={styles.inputStyle}
          placeholder={English.R45}
          onSubmitEditing={onPressChangePassword}
        />
        {isPasswordError && <ErrorText errorText={English.R52} />}
      </>
    )
  }, [
    password,
    confirmPassword,
    confirmPasswordRef,
    setConfirmPassword,
    onPressChangePassword,
    isPasswordError
  ])

  const onPressBack = useCallback(() => {
    navigation.replace(Screens.ForgotPassScreen)
  }, [navigation])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <BackButton onPress={onPressBack} />
          <GettingText>{English.R42}</GettingText>
          <CreateAnAccountText>{English.R43}</CreateAnAccountText>
          {renderChangePasswordView}
          <AppButton
            disabled={!isEnabled}
            style={styles.inputStyle}
            onPress={onPressChangePassword}
            title={English.R66}
          />
        </AppScrollView>
      </ScrollContainer>

      <AppAlertModal
        isVisible={isModal}
        middleText={English.R68}
        topText={English.R67}
        btnText={English.R14}
        onPress={() => navigation.navigate(Screens.LoginScreen)}
        image={Images.passwordReset}
        onClose={() => navigation.navigate(Screens.LoginScreen)}
      />
    </AppContainer>
  )
}

export default NewPasswordScreen
