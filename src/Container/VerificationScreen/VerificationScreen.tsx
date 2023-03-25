import React, {useCallback, useEffect, useState} from 'react'
import {StyleSheet} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import {
  AlreadyAccountText,
  CreateAnAccountText,
  GettingText,
  ScrollContainer
} from '../../CommonStyle/AuthContainer'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppScrollView from '../../Components/AppScrollView'
import BackButton from '../../Components/BackButton'
import Timer from '../../Components/Timer'
import English from '../../Resources/Locales/English'
import {Colors, Screens} from '../../Theme'
import {Fonts} from '../../Theme/Fonts'
import Utility from '../../Theme/Utility'
import OTPInput from './Components/OTPInput'

const VerificationScreen = () => {
  const [otpCode, setOTPCode] = useState('')
  const [isPinReady, setIsPinReady] = useState(false)
  const [isTimer, setIsTimer] = useState(true)
  const params: any = useRoute()?.params
  const email: string = params?.email
  const navigation: any = useNavigation()

  useEffect(() => {
    if (isPinReady) {
      // call otp api here
    }
  }, [isPinReady])

  const onPressChangeEmail = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const onPressConfirm = useCallback(() => {
    if (!Utility.isEmpty(otpCode)) {
      Utility.showToast(English.R53)
      return
    }
    if (otpCode.length < 4) {
      Utility.showToast(English.R54)
      return
    }
    navigation.navigate(Screens.NewPasswordScreen)
  }, [navigation, otpCode])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <BackButton />
          <GettingText>{English.R36}</GettingText>
          <CreateAnAccountText>{English.R37}</CreateAnAccountText>
          <EmailText>
            {email}
            <EmailText onPress={onPressChangeEmail} isClickable>
              {English.R41}
            </EmailText>
          </EmailText>

          <OTPInput
            setIsPinReady={setIsPinReady}
            maximumLength={4}
            code={otpCode}
            setCode={setOTPCode}
          />
          <AlreadyAccountText>
            {English.R38}
            {isTimer ? (
              <Timer onEnd={() => setIsTimer(false)} autoStart initialSeconds={60} />
            ) : (
              <AlreadyAccountText onPress={() => setIsTimer(true)} isClickable>
                {English.R39}
              </AlreadyAccountText>
            )}
          </AlreadyAccountText>
          <RowView>
            <AppButton
              textStyle={styles.resetText}
              style={styles.resendButton}
              title={English.R39}
              isGradient={false}
            />
            <AppButton style={styles.confirmButton} onPress={onPressConfirm} title={English.R40} />
          </RowView>
        </AppScrollView>
      </ScrollContainer>
    </AppContainer>
  )
}

export default VerificationScreen
const RowView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const EmailText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: 15px;
  color: ${(props: any) => (!props.isClickable ? Colors.blackShade2A30 : Colors.ThemeColor)};
`
const styles = StyleSheet.create({
  resendButton: {
    width: '45%',
    borderWidth: 2,
    borderColor: Colors.greyShadeE8,
    backgroundColor: Colors.transparent
  },
  confirmButton: {
    width: '45%'
  },
  resetText: {
    color: Colors.greyShade595
  }
})
