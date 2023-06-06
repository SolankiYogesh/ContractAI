import React from 'react'
import {KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform} from 'react-native'

const IosBottomButtonAvoid = (props: KeyboardAvoidingViewProps) => {
  const {keyboardVerticalOffset} = props
  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === 'ios'}
      behavior={'padding'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    />
  )
}

export default IosBottomButtonAvoid

IosBottomButtonAvoid.defaultProps = {
  keyboardVerticalOffset: 0
}
