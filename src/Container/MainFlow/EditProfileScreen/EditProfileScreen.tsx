import React, {useCallback, useEffect, useRef, useState} from 'react'
import {StyleSheet, TextInput, View} from 'react-native'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker'
import {openSettings} from 'react-native-permissions'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import {ScrollContainer, styles} from '../../../CommonStyle/AuthContainer'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import AppProfileImage from '../../../Components/AppProfileIcon'
import AppScrollView from '../../../Components/AppScrollView'
import Loader from '../../../Components/Loader'
import {setUserData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Colors, Images} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import Permission from '../../../Theme/Permission'
import {moderateScale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import {LabeledText} from '../UserProfileScreen/UserProfileScreen'

const EditProfileScreen = () => {
  const navigation = useNavigation()
  const userData = useSelector((state: any) => state?.user?.userData)
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone_number || '')
  const [firstName, setFirstName] = useState(userData?.first_name || '')
  const [lastName, setlastName] = useState(userData?.last_name || '')
  const [email, setEmail] = useState(userData?.email || '')
  const [brokerName, setBrokername] = useState(userData?.broker?.broker_name || '')
  const [brokerAddress, setbrokerAddress] = useState(userData?.broker?.broker_address || '')
  const [licence, setLicence] = useState(userData?.broker?.broker_license_no || '')
  const [profileUri, setProfileUri] = useState<ImageOrVideo | any>(userData?.profile_image || '')
  const [userLicence, setUserLicence] = useState(userData?.license_no || '')
  const [sLNumber, setSLNumber] = useState(userData?.broker?.supervisor_license_no || '')
  const [PTC, setPTC] = useState(userData?.broker?.title_company || '')
  const [PTCA, setPTCA] = useState(userData?.broker?.title_company_address || '')
  const [address, setAddress] = useState(userData?.address || '')
  const [sName, setSName] = useState(userData?.broker?.supervisor_name || '')
  const dispatch = useDispatch()

  useEffect(() => {
    setPhoneNumber(userData?.phone_number)
    setFirstName(userData?.first_name)
    setlastName(userData?.last_name)
    setEmail(userData?.email)
    setBrokername(userData?.broker?.broker_name)
    setbrokerAddress(userData?.broker?.broker_address)
    setLicence(userData?.broker?.broker_license_no)
    setProfileUri(userData?.profile_image)
    setUserLicence(userData?.license_no)
    setSLNumber(userData?.broker?.supervisor_license_no)
    setPTC(userData?.broker?.title_company)
    setPTCA(userData?.broker?.title_company_address)
    setAddress(userData?.address)
    setSName(userData?.broker?.supervisor_name)
  }, [userData])

  const sNameRef = useRef<TextInput>(null)
  const sNumberRef = useRef<TextInput>(null)
  const ptcRef = useRef<TextInput>(null)
  const ptcaRef = useRef<TextInput>(null)
  const lastNameRef = useRef<TextInput>(null)
  const phoneNumberRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const brokerNameRef = useRef<TextInput>(null)
  const brokerAddressRef = useRef<TextInput>(null)
  const licenceNuRef = useRef<TextInput>(null)
  const [isEnabled, setISEnabled] = useState(false)
  const [submitPressed, setSubmitPressed] = useState(false)
  const [errEmail, setErrEmail] = useState('')
  const [errPhoneNumber, setErrPhoneNumber] = useState('')
  const userLicenceRef = useRef<TextInput>(null)
  const addressRef = useRef<TextInput>(null)

  useEffect(() => {
    setISEnabled(
      !!(
        Utility.isEmpty(PTC) &&
        Utility.isEmpty(PTCA) &&
        Utility.isEmpty(address) &&
        Utility.isEmpty(phoneNumber) &&
        Utility.isEmpty(firstName) &&
        Utility.isEmpty(lastName) &&
        Utility.isEmpty(email) &&
        Utility.isEmpty(brokerAddress) &&
        Utility.isEmpty(brokerName) &&
        Utility.isEmpty(licence) &&
        Utility.isEmpty(profileUri) &&
        Utility.isEmpty(userLicence) &&
        Utility.isEmpty(sLNumber) &&
        Utility.isEmpty(sName)
      )
    )
  }, [
    PTC,
    PTCA,
    address,
    phoneNumber,
    firstName,
    lastName,
    email,
    brokerAddress,
    brokerName,
    licence,
    profileUri,
    userLicence,
    sLNumber,
    sName
  ])

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

  const onChangeEmail = useCallback(
    (text: string) => {
      let errorMessage = ''
      if (submitPressed) {
        if (Utility.isValid(email)) {
          errorMessage = English.R163
        }
      }
      setEmail(text)
      setErrEmail(errorMessage)
    },
    [submitPressed, email]
  )

  const onPressImagePicker = useCallback(async () => {
    const isStorage = await Permission.getStoragePermission()

    if (isStorage) {
      ImagePicker.openPicker({
        cropping: true,
        includeBase64: true
      })
        .then((image) => {
          setProfileUri(image)
        })
        .catch(({message}: any) => {
          Utility.showAlert(message)
        })
    } else {
      openSettings()
    }
  }, [])

  const onPressSave = useCallback(async () => {
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
    if (isValid) {
      const payload = {
        profile_image: {},
        data: {}
      }
      if (profileUri?.data) {
        payload.profile_image = {
          uri: `data:image/jpeg;base64,${profileUri?.data}`,
          type: profileUri.mime,
          name: profileUri.filename
        }
      }

      payload.data = JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        address,
        license_no: userLicence,
        broker: {
          broker_name: brokerName,
          broker_address: brokerAddress,
          broker_license_no: licence,
          supervisor_name: sName,
          supervisor_license_no: sLNumber,
          title_company: PTC,
          title_company_address: PTCA
        }
      })

      Loader.isLoading(true)
      APICall('put', payload, EndPoints.editProfile, {}, true).then((resp: any) => {
        Loader.isLoading(false)
        Utility.showAlert(resp?.data?.message)
        if (resp?.status === 200) {
          if (resp?.data?.data) {
            dispatch(setUserData(resp?.data?.data))
          }
          navigation.goBack()
        }
      })
    }
  }, [
    phoneNumber,
    email,
    firstName,
    lastName,
    address,
    userLicence,
    brokerName,
    brokerAddress,
    licence,
    sName,
    sLNumber,
    PTC,
    PTCA,
    dispatch,
    navigation,
    profileUri
  ])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R151} />
      <ScrollContainer>
        <AppScrollView>
          <ProfileContainer>
            <AppProfileImage
              borderRadius={30}
              url={profileUri?.path || profileUri}
              size={verticalScale(120)}
            />
            <CameraContainer onPress={onPressImagePicker}>
              <CameraIcon source={Images.pencil} />
            </CameraContainer>
          </ProfileContainer>
          <LabeledText color={Colors.greyShadeUnk}>{English.R149}</LabeledText>
          <View style={CommonStyles.row}>
            <AppInput
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType={'next'}
              inputStyle={inputStyleStyle.inputStyle}
              ContainerStyle={styles.fixedWidth}
              placeholder={English.R91}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            <AppInput
              value={lastName}
              onChangeText={setlastName}
              returnKeyType={'next'}
              ContainerStyle={styles.fixedWidth}
              ref={lastNameRef}
              inputStyle={inputStyleStyle.inputStyle}
              placeholder={English.R90}
              onSubmitEditing={() => phoneNumberRef.current?.focus()}
            />
          </View>
          <AppInput
            value={phoneNumber}
            onChangeText={onChangePhoneNumber}
            returnKeyType={'next'}
            ref={phoneNumberRef}
            inputStyle={inputStyleStyle.inputStyle}
            maxLength={14}
            error={errPhoneNumber}
            keyboardType={'number-pad'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R88}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <AppInput
            keyboardType={'email-address'}
            returnKeyType={'next'}
            inputStyle={inputStyleStyle.inputStyle}
            value={email}
            error={errEmail}
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
            ref={emailRef}
            onChangeText={onChangeEmail}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R89}
            onSubmitEditing={() => userLicenceRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={userLicence}
            inputStyle={inputStyleStyle.inputStyle}
            ref={userLicenceRef}
            onChangeText={setUserLicence}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R138}
            onSubmitEditing={() => addressRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={address}
            ref={addressRef}
            inputStyle={inputStyleStyle.inputStyle}
            onChangeText={setAddress}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R174}
            onSubmitEditing={() => brokerNameRef.current?.focus()}
          />

          <LabeledText color={Colors.greyShadeUnk}>{English.R150}</LabeledText>
          <AppInput
            returnKeyType={'next'}
            inputStyle={inputStyleStyle.inputStyle}
            value={brokerName}
            ref={brokerNameRef}
            onChangeText={setBrokername}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R136}
            onSubmitEditing={() => brokerAddressRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={brokerAddress}
            inputStyle={inputStyleStyle.inputStyle}
            ref={brokerAddressRef}
            onChangeText={setbrokerAddress}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R137}
            onSubmitEditing={() => licenceNuRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={licence}
            inputStyle={inputStyleStyle.inputStyle}
            ref={licenceNuRef}
            onChangeText={setLicence}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R138}
            onSubmitEditing={() => sNameRef.current?.focus()}
          />

          <AppInput
            value={sName}
            onChangeText={(text) => setSName(text.replace(/[^a-z]/gi, ''))}
            ref={sNameRef}
            inputStyle={inputStyleStyle.inputStyle}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R169}
            onSubmitEditing={() => sNumberRef?.current?.focus()}
          />
          <AppInput
            value={sLNumber}
            onChangeText={(text) => setSLNumber(text.replace(/[^a-z]/gi, ''))}
            ref={sNumberRef}
            inputStyle={inputStyleStyle.inputStyle}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R170}
            onSubmitEditing={() => ptcRef?.current?.focus()}
          />
          <AppInput
            value={PTC}
            onChangeText={setPTC}
            ref={ptcRef}
            inputStyle={inputStyleStyle.inputStyle}
            returnKeyType={'next'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R171}
            onSubmitEditing={() => ptcaRef?.current?.focus()}
          />
          <AppInput
            value={PTCA}
            inputStyle={inputStyleStyle.inputStyle}
            onChangeText={setPTCA}
            ref={ptcaRef}
            returnKeyType={'done'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R172}
            onSubmitEditing={onPressSave}
          />
        </AppScrollView>
        <AppButton
          disabled={!isEnabled}
          style={styles.width}
          onPress={onPressSave}
          title={English.R66}
        />
      </ScrollContainer>
    </AppContainer>
  )
}

export default EditProfileScreen
const ProfileContainer = styled.View`
  align-items: center;
  margin-top: ${verticalScale(20)}px;
  margin-bottom: ${verticalScale(20)}px;
`
const CameraIcon = styled.Image`
  width: 60%;
  height: 60%;
  tint-color: ${Colors.ThemeColor};
`
const CameraContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${verticalScale(40)}px;
  height: ${verticalScale(40)}px;
  border-radius: ${moderateScale(300)}px;
  border-width: 2px;
  border-color: ${Colors.ThemeColor};
  position: absolute;
  bottom: -${verticalScale(20)}px;
  background-color: ${Colors.white};
`
const inputStyleStyle = StyleSheet.create({
  inputStyle: {
    fontFamily: Fonts.ThemeSemiBold
  }
})
