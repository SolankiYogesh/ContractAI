import React, {useCallback, useEffect, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useDispatch} from 'react-redux'
import {CommonActions, useNavigation} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import ErrorText from '../../../Components/ErrorText'
import Loader from '../../../Components/Loader'
import {logOut} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Screens} from '../../../Theme'
import {ScrollContainer, styles} from '../../../Theme/CommonStyles'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)
  const navigation = useNavigation()
  const [isEnabled, setISEnabled] = useState(false)
  const dispatch = useDispatch()
  const [isPasswordError, setISPasswordError] = useState(false)

  useEffect(() => {
    setISEnabled(
      !!(
        Utility.isEmpty(oldPassword) &&
        Utility.isEmpty(password) &&
        Utility.isEmpty(confirmPassword)
      )
    )
  }, [oldPassword, password, confirmPassword])

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
      old_password: oldPassword,
      new_password: password
    }
    Loader.isLoading(true)
    APICall('put', payload, EndPoints.changePassword)
      .then((resp: any) => {
        Loader.isLoading(false)
        Utility.showAlert(resp?.data?.message)
        if (resp?.status === 200) {
          onPressLogOut()
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        Loader.isLoading(false)
      })
  }, [password, confirmPassword, oldPassword, onPressLogOut])

  const onChangeTextPassword = useCallback((text: string) => {
    setISPasswordError(false)
    setPassword(text)
  }, [])

  const onChangeTextConfirmPassword = useCallback((text: string) => {
    setISPasswordError(false)
    setConfirmPassword(text)
  }, [])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R142} />
      <ScrollContainer marginTop={verticalScale(50)}>
        <AppScrollView>
          <AppInput
            value={oldPassword}
            onChangeText={setOldPassword}
            isPassword
            isEye
            autoComplete={'off'}
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            isAnimated
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R144}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <AppInput
            value={password}
            onChangeText={onChangeTextPassword}
            ref={passwordRef}
            isPassword
            isEye
            isAnimated
            autoComplete={'off'}
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R145}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          {isPasswordError && <ErrorText errorText={English.R52} />}
          <AppInput
            isAnimated
            autoComplete={'off'}
            value={confirmPassword}
            onChangeText={onChangeTextConfirmPassword}
            ref={confirmPasswordRef}
            isPassword
            isEye
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType={'done'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R146}
            onSubmitEditing={onPressChangePassword}
          />
        </AppScrollView>
        <AppButton
          disabled={!isEnabled}
          style={styles.width}
          onPress={onPressChangePassword}
          title={English.R66}
        />
      </ScrollContainer>
    </AppContainer>
  )
}

export default ChangePasswordScreen
