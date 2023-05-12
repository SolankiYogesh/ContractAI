import React from 'react'
import {useRoute} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import BrokerRegisterScreen from '../Container/LoginFlow/BrokerRegisterScreen/BrokerRegisterScreen'
import ForgotPassScreen from '../Container/LoginFlow/ForgotPassScreen/ForgotPassScreen'
import LoginScreen from '../Container/LoginFlow/LoginScreen/LoginScreen'
import PagerScreen from '../Container/LoginFlow/PagerScreen/PagerScreen'
import RegisterScreen from '../Container/LoginFlow/RegisterScreen/RegisterScreen'
import VerificationScreen from '../Container/LoginFlow/VerificationScreen/VerificationScreen'
import NewPasswordScreen from '../Container/MainFlow/NewPasswordScreen/NewPasswordScreen'
import {Screens} from '../Theme'
import Utility from '../Theme/Utility'

const Stack = createNativeStackNavigator()

const AuthNavigation = () => {
  const route: any = useRoute()
  const isLogOut = route?.params?.isLogOut
  return (
    <Stack.Navigator
      screenOptions={Utility.navigationOptions}
      initialRouteName={isLogOut ? Screens.LoginScreen : Screens.PagerScreen}
    >
      <Stack.Screen name={Screens.PagerScreen} component={PagerScreen} />
      <Stack.Screen name={Screens.LoginScreen} component={LoginScreen} />

      <Stack.Screen name={Screens.RegisterScreen} component={RegisterScreen} />
      <Stack.Screen name={Screens.ForgotPassScreen} component={ForgotPassScreen} />
      <Stack.Screen name={Screens.VerificationScreen} component={VerificationScreen} />
      <Stack.Screen name={Screens.NewPasswordScreen} component={NewPasswordScreen} />
      <Stack.Screen name={Screens.BrokerRegisterScreen} component={BrokerRegisterScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigation
