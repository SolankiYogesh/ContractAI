/* eslint-disable react-hooks/exhaustive-deps */
import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  Image,
  ImageSourcePropType,
  Pressable,
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
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {Constant, Images} from '../Theme'
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
  errorStyle?: StyleProp<TextStyle>
  isAnimated?: boolean
}

const AppInput = forwardRef<TextInput, AppInputProps>((props: AppInputProps, ref) => {
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
    errorStyle = {},
    isAnimated = false
  } = props
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable)
  const [isPassword, setIsPassword] = useState(false)
  const [isFocus, setISFocus] = useState(false)
  const translateY = useSharedValue(0)
  const textInputRef = useRef<TextInput>(null)
  const ConstantPosition = useMemo(
    () => (Constant.isAndroid ? -verticalScale(40) / 2 : -INPUT_HEIGHT / 2),
    []
  )

  useEffect(() => {
    if (props.isPassword) {
      setIsPassword(true)
    }
  }, [props.isPassword])

  useEffect(() => {
    if (isAnimated) {
      if (value || isFocus) {
        translateY.value = withTiming(ConstantPosition)
      } else {
        translateY.value = withTiming(0)
      }
    }
  }, [value, isFocus, isAnimated])

  const animatedPlaceHolderStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        translateY.value,
        [0, ConstantPosition],
        [Colors.PlaceHolderColor, isFocus ? Colors.ThemeColor : Colors.PlaceHolderColor]
      ),
      fontSize: interpolate(translateY.value, [0, ConstantPosition], [15, 11])
    }
  }, [translateY.value, ConstantPosition])

  const animatedTouchableOpacityStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value
        }
      ]
    }
  }, [translateY.value, ConstantPosition])

  const setRefs = useCallback(
    (node: TextInput | null) => {
      if (ref) {
        ref.current = node
      }
      textInputRef.current = node
    },
    [ref]
  )

  return (
    <TouchableOpacity style={styles.parentStyle} disabled={!onPress} onPress={onPress}>
      {isAnimated && Constant.isIOS && (
        <AnimatedTouchableOpacity
          onPress={() => {
            if (textInputRef.current) {
              textInputRef.current?.focus()
            }
          }}
          style={[styles.animateButton, animatedTouchableOpacityStyle]}
        >
          <Animated.Text style={[styles.placeHolderStyle, animatedPlaceHolderStyle]}>
            {placeholder}
          </Animated.Text>
        </AnimatedTouchableOpacity>
      )}
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
        {isAnimated && Constant.isAndroid && (
          <AnimatedTouchableOpacity
            onPress={() => {
              if (textInputRef.current) {
                textInputRef.current?.focus()
              }
            }}
            style={[styles.animateButton, animatedTouchableOpacityStyle]}
          >
            <Animated.Text style={[styles.placeHolderStyle, animatedPlaceHolderStyle]}>
              {placeholder}
            </Animated.Text>
          </AnimatedTouchableOpacity>
        )}
        <TextInput
          onChangeText={onChangeText}
          value={value}
          ref={setRefs}
          onFocus={() => setISFocus(true)}
          onBlur={() => setISFocus(false)}
          editable={editable}
          multiline={isMultiline}
          placeholderTextColor={Colors.PlaceHolderColor}
          selectionColor={Colors.ThemeColor}
          style={[
            styles.input,
            inputStyle,
            isMultiline && styles.multiStyle,
            isAnimated && Constant.isAndroid && styles.animatedInput
          ]}
          {...{...props, placeholder: isAnimated ? '' : placeholder}}
          secureTextEntry={isPassword}
        />

        {rightImage && (
          <View style={styles.imageCointainer}>
            <Image style={styles.imageStyle} source={rightImage} />
          </View>
        )}
        {props?.isPassword && isEye && (
          <EyeContainer
            style={(isAnimated && Constant.isAndroid && styles.animatedeye) || {}}
            onPress={() => setIsPassword(!isPassword)}
          >
            <EyeImage
              style={tint}
              tintColor={Colors.greyShadeA0}
              source={isPassword ? Images.eye : Images.hide_eye}
            />
          </EyeContainer>
        )}
      </LinearGradient>
      {!!error && <ErrorText style={errorStyle} errorText={error} />}
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
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    zIndex: 0
  },
  parentStyle: {
    marginVertical: verticalScale(10),
    justifyContent: 'center'
  },
  activeContainer: {
    borderColor: Colors.ThemeColor,
    backgroundColor: Colors.white,
    zIndex: 0
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
    height: INPUT_HEIGHT,
    zIndex: 0
  },
  animatedInput: {
    position: 'absolute',
    left: scale(10),
    flex: 1,
    width: '100%'
  },
  multiStyle: {
    height: heightPx(40),
    textAlignVertical: 'top',
    paddingTop: verticalScale(15),
    zIndex: 0
  },
  placeHolderStyle: {
    color: Colors.PlaceHolderColor,
    fontSize: moderateScale(15),
    fontFamily: Fonts.ThemeRegular,
    overflow: 'hidden',
    zIndex: 1000
  },
  animateButton: {
    zIndex: 1000,
    backgroundColor: Colors.greyShadeF7F,
    padding: scale(2),
    marginLeft: scale(10),
    alignSelf: 'flex-start',
    position: Constant.isAndroid ? 'relative' : 'absolute'
  },
  animatedeye: {
    position: 'absolute',
    right: scale(10)
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
