import React, {useCallback, useMemo, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../CommonStyle/AuthContainer'
import AppAlertModal from '../../Components/AppAlertModal'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppInput from '../../Components/AppInput'
import AppScrollView from '../../Components/AppScrollView'
import BackButton from '../../Components/BackButton'
import English from '../../Resources/Locales/English'
import {Images, Screens} from '../../Theme'
import Utility from '../../Theme/Utility'

const NewPasswordScreen = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isModal, setISModal] = useState(false)
  const navigation: any = useNavigation()

  const confirmPasswordRef = useRef<TextInput>(null)

  const onPressChangePassword = useCallback(() => {
    if (!Utility.isEmpty(password)) {
      Utility.showToast(English.R48)
      return
    }
    if (!Utility.isEmpty(confirmPassword)) {
      Utility.showToast(English.R50)
      return
    }
    if (password !== confirmPassword) {
      Utility.showToast(English.R52)
      return
    }
    setISModal(true)
  }, [password, confirmPassword])

  const renderChangePasswordView = useMemo(() => {
    return (
      <>
        <AppInput
          value={password}
          onChangeText={setPassword}
          isPassword
          returnKeyType={'next'}
          ContainerStyle={styles.inputStyle}
          placeholder={English.R44}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        <AppInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          ref={confirmPasswordRef}
          isPassword
          returnKeyType={'done'}
          ContainerStyle={styles.inputStyle}
          placeholder={English.R45}
          onSubmitEditing={onPressChangePassword}
        />
      </>
    )
  }, [
    password,
    confirmPassword,
    confirmPasswordRef,
    setConfirmPassword,
    onPressChangePassword,
    setConfirmPassword
  ])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <BackButton />
          <GettingText>{English.R42}</GettingText>
          <CreateAnAccountText>{English.R43}</CreateAnAccountText>
          {renderChangePasswordView}
          <AppButton
            style={styles.inputStyle}
            onPress={onPressChangePassword}
            title={English.R66}
          />
        </AppScrollView>
      </ScrollContainer>

      {isModal && (
        <AppAlertModal
          middleText={English.R68}
          topText={English.R67}
          btnText={English.R86}
          onPress={() => navigation.navigate(Screens.LoginScreen)}
          image={Images.passwordReset}
          onClose={() => setISModal(false)}
        />
      )}
    </AppContainer>
  )
}

export default NewPasswordScreen
