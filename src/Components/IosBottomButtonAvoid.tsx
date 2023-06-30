import React from 'react'
import {KeyboardAvoidingView, KeyboardAvoidingViewProps} from 'react-native'

import {Constant} from '../Theme'

const IosBottomButtonAvoid = (props: KeyboardAvoidingViewProps) => {
  const {keyboardVerticalOffset} = props
  return (
    <KeyboardAvoidingView
      enabled={Constant.isIOS}
      behavior={'padding'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    />
  )
}

export default IosBottomButtonAvoid

IosBottomButtonAvoid.defaultProps = {
  keyboardVerticalOffset: 0
}
