import React from 'react'
import {ActivityIndicator, StyleSheet, View} from 'react-native'

import {Colors} from '../Theme'

const LoadingView = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={Colors.ThemeColor} />
    </View>
  )
}

export default LoadingView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
