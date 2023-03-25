import React, {useCallback, useState} from 'react'
import {useNavigation} from '@react-navigation/native'

import {
  AlreadyAccountText,
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

const ForgotPassScreen = () => {
  const [wrongEmailModal, setWrongEmailModal] = useState(false)
  const navigation: any = useNavigation()
  const [email, setEmail] = useState('')

  const onPressSendCode = useCallback(() => {
    if (!Utility.isEmpty(email)) {
      Utility.showToast(English.R47)
      return
    }
    if (Utility.isValid(email)) {
      Utility.showToast(English.R51)
      return
    }
    navigation.navigate(Screens.VerificationScreen, {
      email
    })
  }, [navigation, email])

  const onPressLogin = useCallback(() => {
    navigation.navigate(Screens.LoginScreen)
  }, [navigation])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <BackButton />
          <GettingText>{English.R32}</GettingText>
          <CreateAnAccountText>{English.R33}</CreateAnAccountText>
          <AppInput
            keyboardType={'email-address'}
            returnKeyType={'done'}
            value={email}
            onSubmitEditing={onPressSendCode}
            onChangeText={setEmail}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R17}
          />
          <AppButton style={styles.inputStyle} onPress={onPressSendCode} title={English.R34} />
          <AlreadyAccountText>
            {English.R35}
            <AlreadyAccountText isClickable onPress={onPressLogin}>
              {English.R19}
            </AlreadyAccountText>
          </AlreadyAccountText>
        </AppScrollView>
      </ScrollContainer>
      {wrongEmailModal && (
        <AppAlertModal
          middleText={English.R46}
          topText={English.R87}
          btnText={English.R86}
          image={Images.image404}
          onPress={() => navigation.navigate(Screens.LoginScreen)}
          onClose={() => setWrongEmailModal(false)}
        />
      )}
    </AppContainer>
  )
}

export default ForgotPassScreen
