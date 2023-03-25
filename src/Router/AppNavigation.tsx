import React from 'react'
import RNBootSplash from 'react-native-bootsplash'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import ChangePasswordScreen from '../Container/ChangePasswordScreen/ChangePasswordScreen'
import ContactDetailsScreen from '../Container/ContactDetailsScreen/ContactDetailsScreen'
import EditProfileScreen from '../Container/EditProfileScreen/EditProfileScreen'
import FeedbackScreen from '../Container/FeedbackScreen/FeedbackScreen'
import OfferDetailsScreen from '../Container/OfferDetailsScreen/OfferDetailsScreen'
import OffersScreen from '../Container/OffersScreen/OffersScreen'
import PremiumPlanScreen from '../Container/PremiumPlanScreen/PremiumPlanScreen'
import UserProfileScreen from '../Container/UserProfileScreen/UserProfileScreen'
import {Screens} from '../Theme'
import Utility from '../Theme/Utility'
import AuthNavigation from './AuthNavigation'
import DrawerNavigation from './DrawerNavigation'

const Stack = createNativeStackNavigator()

const AppNavigation = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={() => RNBootSplash.hide()}>
        <Stack.Navigator
          screenOptions={Utility.navigationOptions}
          initialRouteName={Screens.Drawer}
        >
          <Stack.Screen name={Screens.AuthKey} component={AuthNavigation} />
          <Stack.Screen name={Screens.Drawer} component={DrawerNavigation} />
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
