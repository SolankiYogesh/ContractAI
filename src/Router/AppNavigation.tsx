/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import {useDispatch, useSelector} from 'react-redux'
import {CommonActions, NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import ChangePasswordScreen from '../Container/MainFlow/ChangePasswordScreen/ChangePasswordScreen'
import ContactDetailsScreen from '../Container/MainFlow/ContactDetailsScreen/ContactDetailsScreen'
import ContactListScreen from '../Container/MainFlow/ContactListScreen/ContactListScreen'
import EditProfileScreen from '../Container/MainFlow/EditProfileScreen/EditProfileScreen'
import EmailTemplateScreen from '../Container/MainFlow/EmailTemplateScreen/EmailTemplateScreen'
import FeedbackScreen from '../Container/MainFlow/FeedbackScreen/FeedbackScreen'
import OfferDetailsScreen from '../Container/MainFlow/OffersScreen/OfferDetailsScreen/OfferDetailsScreen'
import OffersScreen from '../Container/MainFlow/OffersScreen/OffersScreen'
import PremiumPlanScreen from '../Container/MainFlow/PremiumPlanScreen/PremiumPlanScreen'
import UserProfileScreen from '../Container/MainFlow/UserProfileScreen/UserProfileScreen'
import {logOut, setToken} from '../Redux/Reducers/UserSlice'
import {Screens} from '../Theme'
import Constant, {emitter} from '../Theme/Constant'
import Utility from '../Theme/Utility'
import AuthNavigation from './AuthNavigation'
import DrawerNavigation from './DrawerNavigation'
import {navigationRef} from './Rootnavigation'

const Stack = createNativeStackNavigator()

const AppNavigation = () => {
  const user = useSelector((state: any) => state?.user?.userData)
  const [isLogin, setISLogin] = useState(false)
  const disaptch = useDispatch()

  useEffect(() => {
    setISLogin(user?.token)
  }, [user])

  useEffect(() => {
    const emit1 = emitter.addListener(Constant.eventListenerKeys.updateToken, (data: any) => {
      setTimeout(() => {
        Constant.token = data?.token
        Constant.refresh = data?.refresh_token
        disaptch(setToken(data))
      }, 5000)
    })
    Constant.token = user?.token
    Constant.refresh = user?.refresh_token

    const emit2 = emitter.addListener(Constant.eventListenerKeys.logOut, () => {
      Utility.destroyVoice()
      navigationRef.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.AuthKey,
              params: {
                isLogOut: true
              }
            }
          ]
        })
      )
      disaptch(logOut())
    })
    return () => {
      emit1.remove()
      emit2.remove()
    }
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onReady={() => SplashScreen.hide()}>
        <Stack.Navigator
          screenOptions={Utility.navigationOptions}
          initialRouteName={isLogin ? Screens.Drawer : Screens.AuthKey}
        >
          <Stack.Screen name={Screens.AuthKey} component={AuthNavigation} />
          <Stack.Screen name={Screens.Drawer} component={DrawerNavigation} />
          <Stack.Screen name={Screens.ContactListScreen} component={ContactListScreen} />
          <Stack.Screen name={Screens.EmailTemplateScreen} component={EmailTemplateScreen} />
          <Stack.Screen name={Screens.EditProfileScreen} component={EditProfileScreen} />
          <Stack.Screen name={Screens.ChangePasswordScreen} component={ChangePasswordScreen} />
          <Stack.Screen name={Screens.OfferDetailsScreen} component={OfferDetailsScreen} />
          <Stack.Screen name={Screens.OffersScreen} component={OffersScreen} />
          <Stack.Screen name={Screens.FeedbackScreen} component={FeedbackScreen} />
          <Stack.Screen name={Screens.UserProfileScreen} component={UserProfileScreen} />
          <Stack.Screen name={Screens.ContactDetailsScreen} component={ContactDetailsScreen} />
          <Stack.Screen name={Screens.PremiumPlanScreen} component={PremiumPlanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default AppNavigation
