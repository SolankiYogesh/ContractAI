import React, {useCallback, useEffect, useRef, useState} from 'react'
import {TextInput} from 'react-native'
import {useDispatch} from 'react-redux'
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import {
  CreateAnAccountText,
  GettingText,
  ScrollContainer,
  styles
} from '../../../CommonStyle/AuthContainer'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppInput from '../../../Components/AppInput'
import AppLogo from '../../../Components/AppLogo'
import AppScrollView from '../../../Components/AppScrollView'
import Loader from '../../../Components/Loader'
import {setUserData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Constant, Screens} from '../../../Theme'
import Utility from '../../../Theme/Utility'

const BrokerRegisterScreen = () => {
  const navigation: any = useNavigation()
  const [brokerName, setBrokername] = useState('')
  const [brokerAddress, setBrokerAddress] = useState('')
  const brokerAddRef = useRef<TextInput>(null)
  const [licence, setLicence] = useState('')
  const licenceRef = useRef<TextInput>(null)
  const [sLNumber, setSLNumber] = useState('')
  const [PTC, setPTC] = useState('')
  const [PTCA, setPTCA] = useState('')
  const dispatch = useDispatch()
  const [isEnabled, setISEnabled] = useState(false)
  const [sName, setSName] = useState('')
  const sNameRef = useRef<TextInput>(null)
  const sNumberRef = useRef<TextInput>(null)
  const ptcRef = useRef<TextInput>(null)
  const ptcaRef = useRef<TextInput>(null)

  const userData: any = useRoute().params

  useEffect(() => {
    setISEnabled(
      !!(
        Utility.isEmpty(brokerName) &&
        Utility.isEmpty(brokerAddress) &&
        Utility.isEmpty(licence) &&
        Utility.isEmpty(sName) &&
        Utility.isEmpty(sLNumber)
      )
    )
  }, [brokerName, brokerAddress, licence, sName, sLNumber])

  const onLoginSetup = useCallback(
    (resp: any) => {
      Constant.token = resp?.data?.token
      Constant.refresh = resp?.data?.refresh_token
      const cloneData = Utility.deepClone(resp?.data?.data)
      cloneData.token = resp?.data?.token
      cloneData.refresh = resp?.data?.refresh_token

      dispatch(setUserData(cloneData))

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.Drawer,
              params: {
                isLogOut: true
              }
            }
          ]
        })
      )
    },
    [dispatch, navigation]
  )

  const onPressRegister = useCallback(() => {
    if (!Utility.isEmpty(brokerName)) {
      return
    }
    if (!Utility.isEmpty(brokerAddress)) {
      return
    }
    if (!Utility.isEmpty(licence)) {
      return
    }
    if (!Utility.isEmpty(sName)) {
      return
    }
    if (!Utility.isEmpty(sLNumber)) {
      return
    }

    const payload: any = {
      email: userData?.email,
      first_name: userData?.firstName,
      last_name: userData?.lastName,
      phone_number: userData?.phoneNumber,
      address: userData?.address,
      license_no: userData?.userLicence,
      broker: {
        broker_name: brokerName,
        broker_address: brokerAddress,
        broker_license_no: licence,
        supervisor_name: sName,
        supervisor_license_no: sLNumber,
        title_company: PTC,
        title_company_address: PTCA
      }
    }
    if (!userData?.isGoogle) {
      payload.password = userData?.password
    }

    Loader.isLoading(true)

    APICall(
      userData?.isGoogle ? 'put' : 'post',
      payload,
      userData?.isGoogle ? EndPoints.googleLogin : EndPoints.register,
      {},
      false
    )
      .then((resp: any) => {
        Loader.isLoading(false)

        if (resp?.status === 201) {
          navigation.navigate(Screens.VerificationScreen, {
            isRegister: true,
            email: userData?.email
          })
        } else if (resp?.status === 200 && userData?.isGoogle) {
          onLoginSetup(resp)
        } else {
          Utility.showAlert(resp?.data?.message)
        }
      })
      .catch(() => Loader.isLoading(false))
  }, [
    brokerName,
    brokerAddress,
    licence,
    sName,
    sLNumber,
    userData?.email,
    userData?.firstName,
    userData?.lastName,
    userData?.phoneNumber,
    userData?.address,
    userData?.userLicence,
    userData?.isGoogle,
    userData?.password,
    PTC,
    PTCA,
    navigation,
    onLoginSetup
  ])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <AppLogo />
          <GettingText isTopMargin top={20}>
            {English.R74}
          </GettingText>
          <CreateAnAccountText>{English.R24}</CreateAnAccountText>
          <AppInput
            value={brokerName}
            onChangeText={(text) => setBrokername(text.replace(/[^a-z]/gi, ''))}
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
            onSubmitEditing={() => sNameRef.current?.focus()}
          />
          <AppInput
            value={sName}
            onChangeText={(text) => setSName(text.replace(/[^a-z]/gi, ''))}
            ref={sNameRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R169}
            onSubmitEditing={() => sNumberRef?.current?.focus()}
          />
          <AppInput
            value={sLNumber}
            onChangeText={(text) => setSLNumber(text)}
            ref={sNumberRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R170}
            onSubmitEditing={() => ptcRef?.current?.focus()}
          />
          <AppInput
            value={PTC}
            onChangeText={setPTC}
            ref={ptcRef}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R171}
            onSubmitEditing={() => ptcaRef?.current?.focus()}
          />
          <AppInput
            value={PTCA}
            onChangeText={setPTCA}
            ref={ptcaRef}
            returnKeyType={'done'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R172}
            onSubmitEditing={onPressRegister}
          />

          <AppButton
            disabled={!isEnabled}
            style={styles.inputStyle}
            onPress={onPressRegister}
            title={English.R28}
          />
        </AppScrollView>
      </ScrollContainer>
    </AppContainer>
  )
}

export default BrokerRegisterScreen
