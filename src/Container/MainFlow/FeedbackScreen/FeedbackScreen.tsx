import React, {useCallback, useEffect, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppAlertModal from '../../../Components/AppAlertModal'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import BackButton from '../../../Components/BackButton'
import Loader from '../../../Components/Loader'
import English from '../../../Resources/Locales/English'
import {Images} from '../../../Theme'
import {
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../../Theme/CommonStyles'
import Utility from '../../../Theme/Utility'

const FeedbackScreen = () => {
  const messageRef = useRef<TextInput>(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isModal, setISModal] = useState(false)
  const [isEnabled, setISEnabled] = useState(false)
  const navigation: any = useNavigation()
  const user = useSelector((state: any) => state?.user?.userData)

  useEffect(() => {
    setISEnabled(!!(Utility.isEmpty(subject) && Utility.isEmpty(message)))
  }, [subject, message])

  const onPressSubmit = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    if (message.length < 19) {
      Utility.showAlert('message is too short')
      return
    }
    const payload = {
      email: user?.email,
      subject,
      message
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.reportIssue)
      .then(async (resp: any) => {
        Loader.isLoading(false)

        if (resp?.status === 200) {
          await Utility.wait()
          setISModal(true)
        } else {
          Utility.showAlert(resp?.data?.message)
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        Loader.isLoading(false)
      })
  }, [subject, message, setISModal, user])

  return (
    <AppContainer>
      <ScrollContainer>
        <BackButton />
        <AppScrollView>
          <GettingText>{English.R55}</GettingText>
          <CreateAnAccountText>{English.R56}</CreateAnAccountText>
          <AppInput
            onSubmitEditing={() => messageRef.current?.focus()}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R57}
            returnKeyType={'next'}
            value={subject}
            onChangeText={setSubject}
          />
          <AppInput
            onSubmitEditing={() => messageRef.current?.focus()}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R58}
            returnKeyType={'next'}
            isMultiline
            value={message}
            ref={messageRef}
            onChangeText={setMessage}
          />
        </AppScrollView>
      </ScrollContainer>
      <AppButton
        disabled={!isEnabled}
        style={[styles.width, styles.marginBottom]}
        onPress={onPressSubmit}
        title={English.R59}
      />

      <AppAlertModal
        isVisible={isModal}
        middleText={English.R61}
        topText={English.R60}
        btnText={English.R62}
        onPress={() => navigation.goBack()}
        image={Images.feedback}
        onClose={() => {
          setISModal(false)
          navigation.goBack()
        }}
      />
    </AppContainer>
  )
}

export default FeedbackScreen
