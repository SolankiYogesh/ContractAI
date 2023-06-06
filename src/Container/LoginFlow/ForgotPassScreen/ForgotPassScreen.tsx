import React, {useCallback, useEffect, useState} from 'react'
import {View} from 'react-native'
import {useNavigation} from '@react-navigation/native'

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
import TouchText from '../../../Components/TouchText'
import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'

const ForgotPassScreen = () => {
  const [wrongEmailModal, setWrongEmailModal] = useState(false)
  const navigation: any = useNavigation()
  const [email, setEmail] = useState('')
  const [isEnabled, setISEnabled] = useState(false)
  const [isEmailError, setISEmailError] = useState(false)

  useEffect(() => {
    setISEnabled(!!Utility.isEmpty(email))
  }, [email])
  const onPressSendCode = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    setISEmailError(Utility.isValid(email))
    if (Utility.isValid(email)) {
      return
    }
    const payload = {
      email
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.forgotPass)
      .then(async (resp: any) => {
        Loader.isLoading(false)

        if (resp?.status === 200) {
          navigation.navigate(Screens.VerificationScreen, {
            email
          })
        } else if (resp?.status === 400) {
          await Utility.wait()
          setWrongEmailModal(true)
        } else {
          Utility.showAlert(resp?.data?.message || English.R173)
        }
      })
      .catch(() => Loader.isLoading(false))
  }, [navigation, email, setWrongEmailModal])

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
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            onSubmitEditing={onPressSendCode}
            onChangeText={setEmail}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R17}
          />
          {isEmailError && <ErrorText errorText={English.R163} />}
          <AppButton
            disabled={!isEnabled}
            style={styles.inputStyle}
            onPress={onPressSendCode}
            title={English.R34}
          />
          <View style={CommonStyles.onlyRow}>
            <TouchText
              marginTop={verticalScale(30)}
              color={Colors.blackShade2A30}
              marginBottom={0}
              textAlign={'center'}
              text={English.R35}
            />
            <TouchText
              marginTop={verticalScale(30)}
              marginBottom={0}
              textAlign={'center'}
              text={English.R19}
              onPress={onPressLogin}
            />
          </View>
        </AppScrollView>
        <AppAlertModal
          isVisible={wrongEmailModal}
          middleText={English.R46}
          topText={English.R87}
          btnText={English.R86}
          image={Images.image404}
          onPress={() => navigation.navigate(Screens.LoginScreen)}
          onClose={() => setWrongEmailModal(false)}
        />
      </ScrollContainer>
    </AppContainer>
  )
}

export default ForgotPassScreen
