import React, {forwardRef, useEffect, useState} from 'react'
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import {Images} from '../Theme'
import Colors from '../Theme/Colors'
import {Fonts} from '../Theme/Fonts'
import {heightPx, INPUT_HEIGHT, moderateScale, scale, verticalScale} from '../Theme/Responsive'
import ErrorText from './ErrorText'

interface AppInputProps extends TextInputProps {
  placeholder?: string
  onChangeText?: (text: string) => void
  value?: string
  ContainerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  isPassword?: boolean
  isMultiline?: boolean
  rightImage?: ImageSourcePropType
  onPress?: () => void
  editable?: boolean
  isEye?: boolean
  isGradient?: boolean
  error?: string
  parentStyle?: StyleProp<TextStyle>
}

const AppInput = forwardRef((props: AppInputProps, ref: any) => {
  const {
    placeholder = '',
    isMultiline = false,
    onChangeText = () => {},
    value = '',
    ContainerStyle = {},
    inputStyle = {},
    rightImage,
    onPress,
    editable = true,
    isEye = false,
    isGradient = false,
    error = '',
    parentStyle = {}
  } = props
  const [isPassword, setIsPassword] = useState(false)
  const [isFocus, setISFocus] = useState(false)

  useEffect(() => {
    if (props.isPassword) {
      setIsPassword(true)
    }
  }, [props.isPassword])

  return (
    <TouchableOpacity style={parentStyle} disabled={!onPress} onPress={onPress}>
      <LinearGradient
        colors={
          isGradient
            ? [Colors.purpleShade8A63, Colors.purpleShadeB090]
            : [Colors.greyShadeF7F, Colors.greyShadeF7F]
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={91.48}
        style={[
          styles.inputContainer,
          isFocus && styles.activeContainer,
          isMultiline && styles.multiStyle,
          ContainerStyle
        ]}
      >
        <TextInput
          onChangeText={onChangeText}
          value={value}
          ref={ref}
          onFocus={() => setISFocus(true)}
          onBlur={() => setISFocus(false)}
          editable={editable}
          isMultiline
          multiline={isMultiline}
          placeholderTextColor={Colors.PlaceHolderColor}
          placeholder={placeholder}
          selectionColor={Colors.ThemeColor}
          style={[styles.input, inputStyle, isMultiline && styles.multiStyle]}
          {...props}
          secureTextEntry={isPassword}
        />
        {rightImage && (
          <View style={styles.imageCointainer}>
            <Image style={styles.imageStyle} source={rightImage} />
          </View>
        )}
        {props?.isPassword && isEye && (
          <EyeContainer onPress={() => setIsPassword(!isPassword)}>
            <EyeImage
              style={tint}
              tintColor={Colors.greyShadeA0}
              source={isPassword ? Images.eye : Images.hide_eye}
            />
          </EyeContainer>
        )}
      </LinearGradient>
      {!!error && <ErrorText errorText={error} />}
    </TouchableOpacity>
  )
})

export default AppInput

const styles = StyleSheet.create({
  inputContainer: {
    height: INPUT_HEIGHT,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.greyShadeE8,
    marginVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10)
  },
  activeContainer: {
    borderColor: Colors.ThemeColor,
    backgroundColor: Colors.white
  },
  imageCointainer: {
    width: verticalScale(25),
    height: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: '70%',
    height: '70%'
  },
  input: {
    fontSize: moderateScale(15),
    color: Colors.blackShade2A30,
    fontFamily: Fonts.ThemeRegular,
    flex: 1,
    height: INPUT_HEIGHT
  },
  multiStyle: {
    height: heightPx(40),
    textAlignVertical: 'top',
    paddingTop: 15
  }
})

const EyeContainer = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`

const EyeImage = styled.Image`
  width: 90%;
  height: 90%;
`
const tint = {
  tintColor: Colors.greyShadeA0
}
