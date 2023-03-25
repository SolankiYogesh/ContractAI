import React, {useEffect} from 'react'
import {LogBox, TouchableOpacity} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {RootSiblingParent} from 'react-native-root-siblings'

import AppNavigation from './src/Router/AppNavigation'
import {CommonStyles} from './src/Theme/CommonStyles'

LogBox.ignoreAllLogs()

TouchableOpacity.defaultProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.5,
  hitSlop: 20
}

const App = () => {
  useEffect(() => {
    // changeNavigationBarColor(Colors.transparent, true, true)
  }, [])

  return (
    <RootSiblingParent>
      <GestureHandlerRootView style={CommonStyles.flex}>
        <AppNavigation />
      </GestureHandlerRootView>
    </RootSiblingParent>
  )
}

export default App
