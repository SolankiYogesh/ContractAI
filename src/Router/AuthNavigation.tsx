import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import BrokerRegisterScreen from '../Container/BrokerRegisterScreen/BrokerRegisterScreen'
import ForgotPassScreen from '../Container/ForgotPassScreen/ForgotPassScreen'
import LoginScreen from '../Container/LoginScreen/LoginScreen'
import NewPasswordScreen from '../Container/NewPasswordScreen/NewPasswordScreen'
import PagerScreen from '../Container/PagerScreen/PagerScreen'
import RegisterScreen from '../Container/RegisterScreen/RegisterScreen'
import VerificationScreen from '../Container/VerificationScreen/VerificationScreen'
import {Screens} from '../Theme'
import Utility from '../Theme/Utility'

const Stack = createNativeStackNavigator()

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={Utility.navigationOptions}
      initialRouteName={Screens.PagerScreen}
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
