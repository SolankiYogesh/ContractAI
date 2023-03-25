import React, {useCallback, useRef, useState} from 'react'
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
import {Images} from '../../Theme'
import Utility from '../../Theme/Utility'

const FeedbackScreen = () => {
  const messageRef = useRef<TextInput>(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isModal, setISModal] = useState(false)
  const navigation: any = useNavigation()

  const onPressSubmit = useCallback(() => {
    if (!Utility.isEmpty(subject)) {
      Utility.showToast(English.R63)
      return
    }

    if (!Utility.isEmpty(message)) {
      Utility.showToast(English.R64)
      return
    }
    setISModal(true)
  }, [subject, message, setISModal])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <BackButton />
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
            returnKeyType={'done'}
            isMultiline
            value={message}
            ref={messageRef}
            onChangeText={setMessage}
          />
          <AppButton style={styles.inputStyle} onPress={onPressSubmit} title={English.R59} />
        </AppScrollView>
      </ScrollContainer>

      {isModal && (
        <AppAlertModal
          middleText={English.R61}
          topText={English.R60}
          btnText={English.R62}
          onPress={() => navigation.goBack()}
          image={Images.feedback}
          onClose={() => setISModal(false)}
        />
      )}
    </AppContainer>
  )
}

export default FeedbackScreen
