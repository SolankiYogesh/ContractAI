import React, {useState} from 'react'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {createDrawerNavigator} from '@react-navigation/drawer'

import DrawerScreen from '../Components/DrawerScreen'
import ContactListScreen from '../Container/MainFlow/ContactListScreen/ContactListScreen'
import EmailTemplateScreen from '../Container/MainFlow/EmailTemplateScreen/EmailTemplateScreen'
import OffersScreen from '../Container/MainFlow/OffersScreen/OffersScreen'
import PremiumPlanScreen from '../Container/MainFlow/PremiumPlanScreen/PremiumPlanScreen'
import SettingScreen from '../Container/MainFlow/SettingScreen/SettingScreen'
import VoiceChatScreen from '../Container/MainFlow/VoiceChatScreen/VoiceChatScreen'
import {Colors, Screens} from '../Theme'
import {scale, widthPx} from '../Theme/Responsive'
import Utility from '../Theme/Utility'

const Drawer = createDrawerNavigator()
const DrawerNavigation = () => {
  const offsets = useSafeAreaInsets()
  const [isOpen, setISOpen] = useState(false)
  return (
    <Drawer.Navigator
      screenOptions={{
        ...Utility.navigationOptions,
        drawerType: 'front',
        drawerStyle: {
          width: widthPx(90),
          marginTop: offsets.top,
          marginBottom: offsets.bottom,
          marginLeft: isOpen ? scale(10) : 0,
          overflow: 'hidden',
          backgroundColor: Colors.transparent
        },
        keyboardDismissMode: 'on-drag'
      }}
      initialRouteName={Screens.VoiceChatScreen}
      drawerContent={(props) => <DrawerScreen onToggle={setISOpen} {...props} />}
    >
      <Drawer.Screen
        name={Screens.VoiceChatScreen}
        initialParams={{
          isDrawer: true
        }}
        component={VoiceChatScreen}
      />
      <Drawer.Screen
        initialParams={{
          isDrawer: true
        }}
        name={Screens.EmailTemplateScreen}
        component={EmailTemplateScreen}
      />
      <Drawer.Screen
        name={Screens.ContactListScreen}
        initialParams={{
          isDrawer: true
        }}
        component={ContactListScreen}
      />
      <Drawer.Screen
        name={Screens.OffersScreen}
        initialParams={{
          isDrawer: true
        }}
        component={OffersScreen}
      />
      <Drawer.Screen
        name={Screens.PremiumPlanScreen}
        initialParams={{
          isDrawer: true,
          initialIndex: null
        }}
        component={PremiumPlanScreen}
      />
      <Drawer.Screen
        name={Screens.SettingScreen}
        initialParams={{
          isDrawer: true
        }}
        component={SettingScreen}
      />
    </Drawer.Navigator>
  )
}

export default DrawerNavigation
