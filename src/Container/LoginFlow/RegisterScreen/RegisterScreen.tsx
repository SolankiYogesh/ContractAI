import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {TextInput, View} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'

import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppInput from '../../../Components/AppInput'
import AppLogo from '../../../Components/AppLogo'
import AppScrollView from '../../../Components/AppScrollView'
import TNCPrivacy from '../../../Components/TNCPrivacy'
import TNCSheet from '../../../Components/TNCSheet'
import TouchText from '../../../Components/TouchText'
import English from '../../../Resources/Locales/English'
import {Colors, Constant, Screens} from '../../../Theme'
import {
  CommonStyles,
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../../Theme/CommonStyles'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'

const RegisterScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute().params
  const isGoogle = route?.isGoogle
  const [isBottomSheet, setISBottomSheet] = useState({
    isVisible: false,
    isPrivacy: false
  })
  const isSocialLogin = route?.isSocialLogin

  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)
  const [email, setEmail] = useState(isGoogle?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [licence, setLicence] = useState('')
  const licenceRef = useRef<TextInput>(null)
  const [address, setAddress] = useState('')
  const addressRef = useRef<TextInput>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState(isGoogle?.givenName || '')
  const [lastName, setLastName] = useState(isGoogle?.familyName || '')
  const lastNameRef = useRef<TextInput>(null)
  const phoneNumberRef = useRef<TextInput>(null)
  const [isEnabled, setISEnabled] = useState(false)
  const [submitPressed, setSubmitPressed] = useState(false)
  const [errEmail, setErrEmail] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPhoneNumber, setErrPhoneNumber] = useState('')
  const [errConfirmPassword, setErrConfirmPassword] = useState('')
  const isApple = route?.isApple
  const [check, setCheck] = useState(false)

  useEffect(() => {
    setISEnabled(
      !!(
        Utility.isEmpty(firstName) &&
        Utility.isEmpty(lastName) &&
        Utility.isEmpty(phoneNumber) &&
        Utility.isEmpty(email) &&
        Utility.isEmpty(address) &&
        (isGoogle || (Utility.isEmpty(password) && Utility.isEmpty(confirmPassword)))
      )
    )
  }, [email, password, firstName, lastName, phoneNumber, confirmPassword, address, isGoogle])

  const onChangeEmail = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (Utility.isValid(text)) {
          errorMessage = English.R163
        }
      }
      setEmail(text)
      setErrEmail(errorMessage)
    },
    [submitPressed]
  )

  const onChangePhoneNumber = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (text.length < 14) {
          errorMessage = English.R164
        }
      }
      setPhoneNumber(Utility.formatPhoneNumber(text, phoneNumber))
      setErrPhoneNumber(errorMessage)
    },
    [submitPressed, setErrPhoneNumber, setPhoneNumber, phoneNumber]
  )

  const onChangePassword = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (!Utility.validatePassword(password)) {
          errorMessage = English.R165
        }
      }
      setPassword(text)
      setErrPassword(errorMessage)
    },
    [setErrPassword, setPassword, submitPressed, password]
  )

  const onChangeConfirmPassword = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (text !== password) {
          errorMessage = English.R52
        }
      }
      setConfirmPassword(text)
      setErrConfirmPassword(errorMessage)
    },
    [submitPressed, setErrConfirmPassword, setConfirmPassword, password]
  )

  const onPressLogin = useCallback(() => {
    navigation.goBack()
    Constant.BROKERDATA = null
  }, [navigation])

  const formateText = useCallback((text: string) => {
    return text.replace(/[^a-z]/gi, '')
  }, [])

  const onPressRegister = useCallback(() => {
    let isValid = true
    setSubmitPressed(true)
    if (phoneNumber.length < 14) {
      setErrPhoneNumber(English.R164)
      isValid = false
    }
    if (Utility.isValid(email)) {
      setErrEmail(English.R163)
      isValid = false
    }
    if (!isGoogle && !Utility.validatePassword(password)) {
      setErrPassword(English.R165)
      isValid = false
    }
    if (confirmPassword !== password && !isGoogle) {
      setErrConfirmPassword(English.R52)
      isValid = false
    }
    if (!check) {
      Utility.showAlert('Please agree to Terms & Conditions and Privacy Policy')
      isValid = false
    }

    if (isValid) {
      const payload: any = {
        email,
        phoneNumber,
        firstName,
        lastName,
        userLicence: licence,
        address,
        isGoogle: !!isGoogle,
        isApple: !!isApple
      }

      if (!isGoogle) {
        payload.password = password
      }
      navigation.navigate(Screens.BrokerRegisterScreen, {
        ...payload,
        isSocialLogin
      })
    }
  }, [
    phoneNumber,
    email,
    isGoogle,
    password,
    confirmPassword,
    check,
    firstName,
    lastName,
    licence,
    address,
    isApple,
    navigation,
    isSocialLogin
  ])

  const renderSheet = useMemo(() => {
    return (
      isBottomSheet?.isVisible && (
        <TNCSheet
          isPrivacy={isBottomSheet?.isPrivacy}
          onClose={() =>
            setISBottomSheet({
              isPrivacy: false,
              isVisible: false
            })
          }
        />
      )
    )
  }, [isBottomSheet])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <AppLogo />
          <GettingText isTopMargin top={20}>
            {English.R23}
          </GettingText>
          <CreateAnAccountText>{English.R24}</CreateAnAccountText>
          <View style={CommonStyles.row}>
            <AppInput
              value={firstName}
              onChangeText={(text) => setFirstName(formateText(text))}
              returnKeyType={'next'}
              ContainerStyle={styles.fixedWidth}
              placeholder={English.R91}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            <AppInput
              value={lastName}
              onChangeText={(text) => setLastName(formateText(text))}
              returnKeyType={'next'}
              ref={lastNameRef}
              ContainerStyle={styles.fixedWidth}
              placeholder={English.R90}
              onSubmitEditing={() => licenceRef.current?.focus()}
            />
          </View>
          <AppInput
            value={licence}
            onChangeText={setLicence}
            ref={licenceRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R77}
            onSubmitEditing={() => phoneNumberRef.current?.focus()}
          />
          <AppInput
            value={phoneNumber}
            onChangeText={onChangePhoneNumber}
            returnKeyType={'next'}
            ref={phoneNumberRef}
            maxLength={14}
            keyboardType={'number-pad'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R167}
            onSubmitEditing={() => emailRef.current?.focus()}
            error={errPhoneNumber}
          />

          <AppInput
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={email}
            ref={emailRef}
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            editable={!isGoogle?.email}
            onChangeText={onChangeEmail}
            error={errEmail}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R89}
            onSubmitEditing={() => addressRef.current?.focus()}
          />

          <AppInput
            value={address}
            onChangeText={setAddress}
            ref={addressRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R174}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {!isGoogle && (
            <>
              <AppInput
                value={password}
                onChangeText={onChangePassword}
                returnKeyType={'next'}
                ref={passwordRef}
                isPassword
                autoComplete={'off'}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                ContainerStyle={styles.inputStyle}
                placeholder={English.R26}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                error={errPassword}
              />

              <AppInput
                value={confirmPassword}
                returnKeyType={'done'}
                isPassword
                autoComplete={'off'}
                autoCapitalize={'none'}
                autoCorrect={false}
                spellCheck={false}
                onChangeText={onChangeConfirmPassword}
                ref={confirmPasswordRef}
                ContainerStyle={styles.inputStyle}
                onSubmitEditing={onPressRegister}
                placeholder={English.R27}
                error={errConfirmPassword}
              />
            </>
          )}
          <TNCPrivacy
            onChangeValue={setCheck}
            value={check}
            onPressTNC={() =>
              setISBottomSheet({
                isPrivacy: false,
                isVisible: true
              })
            }
            onPressPrivacy={() =>
              setISBottomSheet({
                isPrivacy: true,
                isVisible: true
              })
            }
          />
          <AppButton
            disabled={!isEnabled}
            style={styles.inputStyle}
            onPress={onPressRegister}
            title={English.R80}
          />

          <View style={CommonStyles.onlyRow}>
            <TouchText
              marginTop={verticalScale(10)}
              color={Colors.blackShade2A30}
              marginBottom={verticalScale(30)}
              textAlign={'center'}
              text={English.R13}
            />
            <TouchText
              marginTop={verticalScale(10)}
              marginBottom={verticalScale(30)}
              textAlign={'center'}
              text={English.R14}
              onPress={onPressLogin}
            />
          </View>
        </AppScrollView>
      </ScrollContainer>
      {renderSheet}
    </AppContainer>
  )
}

export default RegisterScreen
