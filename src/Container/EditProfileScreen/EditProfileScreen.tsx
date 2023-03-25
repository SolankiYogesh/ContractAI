import React, {useCallback, useRef, useState} from 'react'
import {TextInput, View} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import {ScrollContainer, styles} from '../../CommonStyle/AuthContainer'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppInput from '../../Components/AppInput'
import AppProfileImage from '../../Components/AppProfileIcon'
import AppScrollView from '../../Components/AppScrollView'
import English from '../../Resources/Locales/English'
import {Colors, Images} from '../../Theme'
import {CommonStyles} from '../../Theme/CommonStyles'
import {moderateScale, verticalScale} from '../../Theme/Responsive'
import Utility from '../../Theme/Utility'
import {LabeledText} from '../UserProfileScreen/UserProfileScreen'

const EditProfileScreen = () => {
  const navigation = useNavigation()
  const [phoneNumber, setPhoneNumber] = useState('1 (800) 315-0190')
  const [firstName, setFirstName] = useState('William')
  const [lastName, setlastName] = useState('Smith')
  const [email, setEmail] = useState('smithnwill@projectile.co')
  const [brokerName, setBrokername] = useState('Devid Biden')
  const [brokerAddress, setbrokerAddress] = useState('123 Jodn Street, Near Cafe shop')
  const [licence, setLicence] = useState('23ET12CDSE')
  const [city, setCity] = useState('San Francisco')
  const [state, setState] = useState('California')
  const [zip, setZip] = useState('324 544')
  const [profileUri, setProfileUri] = useState('https://i.ibb.co/znvXjTV/untitled.png')

  const lastNameRef = useRef<TextInput>(null)
  const phoneNumberRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const brokerNameRef = useRef<TextInput>(null)
  const brokerAddressRef = useRef<TextInput>(null)
  const licenceNuRef = useRef<TextInput>(null)
  const cityRefRef = useRef<TextInput>(null)
  const stateRef = useRef<TextInput>(null)
  const zipRef = useRef<TextInput>(null)

  const onPressImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      cropping: true
    })
      .then((image) => {
        setProfileUri(image.path)
      })
      .catch(({message}: any) => {
        Utility.showToast(message)
      })
  }, [])

  const onPressSave = useCallback(() => {
    if (!Utility.isEmpty(firstName)) {
      Utility.showToast(English.R93)
      return
    }
    if (!Utility.isEmpty(lastName)) {
      Utility.showToast(English.R94)
      return
    }
    if (!Utility.isEmpty(phoneNumber)) {
      Utility.showToast(English.R49)
      return
    }
    if (phoneNumber.length < 10) {
      Utility.showToast(English.R92)
      return
    }
    if (!Utility.isEmpty(email)) {
      Utility.showToast(English.R47)
      return
    }
    if (Utility.isValid(email)) {
      Utility.showToast(English.R51)
      return
    }
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
    if (!Utility.isEmpty(city)) {
      Utility.showToast(English.R153)
      return
    }
    if (!Utility.isEmpty(state)) {
      Utility.showToast(English.R84)
      return
    }
    if (!Utility.isEmpty(zip)) {
      Utility.showToast(English.R84)
      return
    }
    if (zip.length < 6) {
      Utility.showToast(English.R152)
      return
    }
    Utility.showToast('Profile updated!')
    navigation.goBack()
  }, [
    email,
    phoneNumber,
    firstName,
    lastName,
    brokerName,
    brokerAddress,
    licence,
    zip,
    state,
    city
  ])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R151} />
      <ScrollContainer>
        <AppScrollView>
          <ProfileContainer>
            <AppProfileImage borderRadius={30} url={profileUri} size={122} />
            <CameraContainer onPress={onPressImagePicker}>
              <CameraIcon source={Images.camera} />
            </CameraContainer>
          </ProfileContainer>
          <LabeledText color={Colors.greyShadeUnk}>{English.R149}</LabeledText>
          <View style={CommonStyles.row}>
            <AppInput
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType={'next'}
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
              placeholder={English.R90}
              onSubmitEditing={() => phoneNumberRef.current?.focus()}
            />
          </View>
          <AppInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            returnKeyType={'next'}
            ref={phoneNumberRef}
            keyboardType={'number-pad'}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R88}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <AppInput
            keyboardType={'email-address'}
            returnKeyType={'next'}
            value={email}
            ref={emailRef}
            onChangeText={setEmail}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R89}
            onSubmitEditing={() => brokerNameRef.current?.focus()}
          />
          <LabeledText color={Colors.greyShadeUnk}>{English.R150}</LabeledText>
          <AppInput
            returnKeyType={'next'}
            value={brokerName}
            ref={brokerNameRef}
            onChangeText={setBrokername}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R136}
            onSubmitEditing={() => brokerNameRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={brokerAddress}
            ref={brokerAddressRef}
            onChangeText={setbrokerAddress}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R137}
            onSubmitEditing={() => licenceNuRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={licence}
            ref={licenceNuRef}
            onChangeText={setLicence}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R138}
            onSubmitEditing={() => cityRefRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={city}
            ref={cityRefRef}
            onChangeText={setCity}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R139}
            onSubmitEditing={() => stateRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'next'}
            value={state}
            ref={stateRef}
            onChangeText={setState}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R140}
            onSubmitEditing={() => zipRef.current?.focus()}
          />
          <AppInput
            returnKeyType={'done'}
            value={zip}
            ref={zipRef}
            maxLength={6}
            keyboardType={'phone-pad'}
            onChangeText={setZip}
            ContainerStyle={styles.inputStyle}
            placeholder={English.R141}
            onSubmitEditing={onPressSave}
          />
        </AppScrollView>
        <AppButton style={styles.width} onPress={onPressSave} title={English.R66} />
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
  width: 80%;
  height: 80%;
`
const CameraContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${verticalScale(40)}px;
  height: ${verticalScale(40)}px;
  border-radius: ${moderateScale(300)}px;
  border-width: 2;
  border-color: ${Colors.ThemeColor};
  position: absolute;
  bottom: -${verticalScale(20)}px;
  background-color: ${Colors.white};
`
