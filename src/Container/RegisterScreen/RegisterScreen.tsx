import React, {useCallback, useRef, useState} from 'react'
import {TextInput, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'

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
import {Images, Screens} from '../../Theme'
import {CommonStyles} from '../../Theme/CommonStyles'
import Utility from '../../Theme/Utility'

const RegisterScreen = () => {
  const navigation: any = useNavigation()
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const lastNameRef = useRef<TextInput>(null)
  const phoneNumberRef = useRef<TextInput>(null)

  const onPressLogin = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const onPressGoogleLogin = useCallback(() => {
    Utility.showToast('You are going to login with google')
  }, [navigation])

  const onPressRegister = useCallback(() => {
    if (!Utility.isEmpty(firstName)) {
      Utility.showToast(English.R93)
      return
    }
    if (!Utility.isEmpty(lastName)) {
      Utility.showToast(English.R94)
      return
    }

    if (!Utility.isEmpty(phoneNumber)) {
      Utility.showToast(English.R49)
      return
    }
    if (phoneNumber.length < 10) {
      Utility.showToast(English.R92)
      return
    }
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
    if (!Utility.isEmpty(confirmPassword)) {
      Utility.showToast(English.R50)
      return
    }
    if (password !== confirmPassword) {
      Utility.showToast(English.R52)
      return
    }

    navigation.navigate(Screens.BrokerRegisterScreen)
  }, [email, password, phoneNumber, confirmPassword, firstName, lastName])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <GettingText isTopMargin>{English.R23}</GettingText>
          <CreateAnAccountText>{English.R24}</CreateAnAccountText>
          <View style={CommonStyles.row}>
            <AppInput
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType={'next'}
              ContainerStyle={styles.input2Style}
              placeholder={English.R91}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            <AppInput
              value={lastName}
              onChangeText={setlastName}
              returnKeyType={'next'}
              ref={lastNameRef}
              ContainerStyle={styles.input2Style}
              placeholder={English.R90}
              onSubmitEditing={() => phoneNumberRef.current?.focus()}
            />
          </View>
          <AppInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            returnKeyType={'next'}
            ref={phoneNumberRef}
            keyboardType={'number-pad'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R88}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <AppInput
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={email}
            ref={emailRef}
            onChangeText={setEmail}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R89}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <AppInput
            value={password}
            onChangeText={setPassword}
            returnKeyType={'next'}
            ref={passwordRef}
            isPassword
            ContainerStyle={styles.inputStyle}
            placeholder={English.R26}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          <AppInput
            value={confirmPassword}
            returnKeyType={'done'}
            isPassword
            onChangeText={setConfirmPassword}
            ref={confirmPasswordRef}
            ContainerStyle={styles.inputStyle}
            onSubmitEditing={onPressRegister}
            placeholder={English.R27}
          />
          <AppButton style={styles.inputStyle} onPress={onPressRegister} title={English.R80} />
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
            {English.R13}
            <AlreadyAccountText isClickable onPress={onPressLogin}>
              {English.R14}
            </AlreadyAccountText>
          </AlreadyAccountText>
        </AppScrollView>
      </ScrollContainer>
    </AppContainer>
  )
}

export default RegisterScreen
