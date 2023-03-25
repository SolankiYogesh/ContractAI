import React, {useCallback, useRef, useState} from 'react'
import {TextInput} from 'react-native'

import {
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
import Utility from '../../Theme/Utility'

const BrokerRegisterScreen = () => {
  const [brokerName, setBrokername] = useState('')
  const [brokerAddress, setBrokerAddress] = useState('')
  const brokerAddRef = useRef<TextInput>(null)
  const [licence, setLicence] = useState('')
  const licenceRef = useRef<TextInput>(null)
  const [state, setSate] = useState('')
  const stateRef = useRef<TextInput>(null)
  const [zip, setZip] = useState('')
  const zipRef = useRef<TextInput>(null)

  const onPressRegister = useCallback(() => {
    if (!Utility.isEmpty(brokerName)) {
      Utility.showToast(English.R81)
      return
    }
    if (!Utility.isEmpty(brokerAddress)) {
      Utility.showToast(English.R82)
      return
    }
    if (!Utility.isEmpty(licence)) {
      Utility.showToast(English.R83)
      return
    }
    if (!Utility.isEmpty(state)) {
      Utility.showToast(English.R84)
      return
    }

    if (!Utility.isEmpty(zip)) {
      Utility.showToast(English.R85)
    }
    if (zip.length < 6) {
      Utility.showToast(English.R152)
    }
  }, [zip, state, licence, brokerAddress, brokerName])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <GettingText isTopMargin>{English.R74}</GettingText>
          <CreateAnAccountText>{English.R16}</CreateAnAccountText>
          <AppInput
            value={brokerName}
            onChangeText={setBrokername}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R75}
            onSubmitEditing={() => brokerAddRef.current?.focus()}
          />
          <AppInput
            value={brokerAddress}
            onChangeText={setBrokerAddress}
            ref={brokerAddRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R76}
            onSubmitEditing={() => licenceRef.current?.focus()}
          />
          <AppInput
            value={licence}
            onChangeText={setLicence}
            ref={licenceRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R77}
            onSubmitEditing={() => stateRef.current?.focus()}
          />
          <AppInput
            value={state}
            onChangeText={setSate}
            ref={stateRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R78}
            onSubmitEditing={() => zipRef?.current?.focus()}
          />
          <AppInput
            value={zip}
            onChangeText={setZip}
            ref={zipRef}
            keyboardType={'phone-pad'}
            maxLength={6}
            returnKeyType={'done'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R79}
            onSubmitEditing={onPressRegister}
          />
          <AppButton style={styles.inputStyle} onPress={onPressRegister} title={English.R28} />
        </AppScrollView>
      </ScrollContainer>
    </AppContainer>
  )
}

export default BrokerRegisterScreen
