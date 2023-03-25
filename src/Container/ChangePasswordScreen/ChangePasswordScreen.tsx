import React, {useCallback, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {ScrollContainer, styles} from '../../CommonStyle/AuthContainer'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppInput from '../../Components/AppInput'
import AppScrollView from '../../Components/AppScrollView'
import English from '../../Resources/Locales/English'
import {verticalScale} from '../../Theme/Responsive'
import Utility from '../../Theme/Utility'

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordRef = useRef<TextInput>(null)
  const confirmPasswordRef = useRef<TextInput>(null)
  const navigation = useNavigation()

  const onPressChangePassword = useCallback(() => {
    if (!Utility.isEmpty(oldPassword)) {
      Utility.showToast(English.R147)
      return
    }
    if (!Utility.isEmpty(password)) {
      Utility.showToast(English.R148)
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
    Utility.showToast('password Changed')
    navigation.goBack()
  }, [password, confirmPassword, oldPassword])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R142} />
      <ScrollContainer marginTop={verticalScale(50)}>
        <AppScrollView>
          <AppInput
            value={oldPassword}
            onChangeText={setOldPassword}
            isPassword
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R144}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <AppInput
            value={password}
            onChangeText={setPassword}
            ref={passwordRef}
            isPassword
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R145}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />
          <AppInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            ref={confirmPasswordRef}
            isPassword
            returnKeyType={'done'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R146}
            onSubmitEditing={onPressChangePassword}
          />
        </AppScrollView>
        <AppButton style={styles.width} onPress={onPressChangePassword} title={English.R66} />
      </ScrollContainer>
    </AppContainer>
  )
}

export default ChangePasswordScreen
