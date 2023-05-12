import React, {useEffect, useRef, useState} from 'react'
import {TextInput} from 'react-native'

import {
  OTPInputContainer,
  SplitBoxes,
  SplitBoxText,
  SplitOTPBoxesContainer,
  TextInputHidden
} from './OTPInputStyle'

const OTPInput = ({code, setCode, maximumLength, setIsPinReady}: any) => {
  const boxArray = new Array(maximumLength).fill(0)
  const inputRef = useRef<TextInput>(null)

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false)

  const handleOnPress = () => {
    setIsInputBoxFocused(true)
    if (inputRef.current) inputRef.current?.focus()
  }

  const handleOnBlur = () => {
    setIsInputBoxFocused(false)
  }

  useEffect(() => {
    // update pin ready status
    setIsPinReady(code.length === maximumLength)
    // clean up function
    return () => {
      setIsPinReady(false)
    }
  }, [code, maximumLength, setIsPinReady])
  const boxDigit = (_: any, index: number) => {
    const emptyInput = ''
    const digit = code[index] || emptyInput

    const isCurrentValue = index === code.length
    const isLastValue = index === maximumLength - 1
    const isCodeComplete = code.length === maximumLength

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete)

    return (
      <SplitBoxes isFilled={!!digit || (isInputBoxFocused && isValueFocused)} key={index}>
        <SplitBoxText>{digit}</SplitBoxText>
      </SplitBoxes>
    )
  }

  return (
    <OTPInputContainer>
      <SplitOTPBoxesContainer onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </SplitOTPBoxesContainer>
      <TextInputHidden
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        ref={inputRef}
        keyboardType={'number-pad'}
        onBlur={handleOnBlur}
      />
    </OTPInputContainer>
  )
}

export default OTPInput
