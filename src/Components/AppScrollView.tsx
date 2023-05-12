import React from 'react'
import {Platform, ScrollViewProps, StyleProp, ViewStyle} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

interface AppScrollViewProps extends ScrollViewProps {
  children?: React.ReactNode
  innerRef?: any
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  stickyHeaderIndices?: number[]
}

const AppScrollView = (props: AppScrollViewProps) => {
  const {children, stickyHeaderIndices, innerRef, style, contentContainerStyle = {}} = props
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      ref={(ref: any) => innerRef(ref)}
      contentContainerStyle={contentContainerStyle}
      style={style}
      bounces={false}
      extraHeight={20}
      extraScrollHeight={Platform.OS === 'ios' ? 0 : 10}
      stickyHeaderIndices={stickyHeaderIndices}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}

export default AppScrollView

AppScrollView.defaultProps = {
  innerRef: () => {}
}
