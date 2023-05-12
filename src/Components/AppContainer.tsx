import React from 'react'
import {SafeAreaView, StatusBar, StatusBarStyle, StyleProp, View, ViewStyle} from 'react-native'
import styled from 'styled-components/native'

import {Colors} from '../Theme'

interface AppContainerProps {
  isTopSafeArea?: boolean
  isBottomSafeArea?: boolean
  bottomStyle?: StyleProp<ViewStyle>
  topStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
  barStyle?: StatusBarStyle
  translucent?: boolean
  statusbarColor?: string
}

const AppContainer = (props: AppContainerProps) => {
  const {
    isTopSafeArea,
    isBottomSafeArea,
    bottomStyle = {},
    barStyle = 'dark-content',
    topStyle = {},
    style,
    children,
    translucent = false,
    statusbarColor = Colors.white
  } = props
  const TopComponent = isTopSafeArea ? SafeAreaView : View
  const BottomComponent = isBottomSafeArea ? SafeAreaView : View
  return (
    <Container style={style}>
      <StatusBar translucent={translucent} backgroundColor={statusbarColor} barStyle={barStyle} />
      <TopComponent style={topStyle} />
      <Container>{children}</Container>
      <BottomComponent style={bottomStyle} />
    </Container>
  )
}

export default AppContainer

AppContainer.defaultProps = {
  isTopSafeArea: true,
  isBottomSafeArea: false,
  statusBarColor: Colors.white,
  isLightStatusBar: true,
  topStyle: {
    backgroundColor: Colors.white
  },
  bottomStyle: {
    backgroundColor: Colors.white
  }
}

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`
