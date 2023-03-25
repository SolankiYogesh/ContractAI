import React, {useCallback, useMemo, useRef, useState} from 'react'
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet'

import English from '../../../Resources/Locales/English'
import {Colors, Images} from '../../../Theme'
import {Fonts} from '../../../Theme/Fonts'
import {
  heightPx,
  INPUT_HEIGHT,
  moderateScale,
  scale,
  verticalScale,
  widthPx
} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import VoiceDataItem from './VoiceDataItem'
import VoiceTextItem from './VoiceTextItem'

const TransScriptBottomSheet = () => {
  const snapPoints = useMemo(() => [INPUT_HEIGHT, heightPx(50), heightPx(92)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [index, setIndex] = useState(0)
  const animatedPosition = useSharedValue(0)
  const halfWdith = widthPx(45)
  const AnimatedLineargradient = Animated.createAnimatedComponent(LinearGradient)

  const colors = [Colors.purpleShad8A, Colors.purpleShadB0]
  const transparencies = [Colors.transparent, Colors.transparent]
  Animated.addWhitelistedNativeProps({
    colors: true
  })

  const animatedProps = useAnimatedProps(() => {
    return {
      colors: [
        interpolateColor(animatedPosition.value, [1, 2], [colors[0], transparencies[0]]),
        interpolateColor(animatedPosition.value, [1, 2], [colors[1], transparencies[1]])
      ]
    }
  }, [animatedPosition.value])

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedPosition.value, [1, 2], [1, 0])
    }
  }, [animatedPosition])

  const animatedTranslateStyle = useAnimatedStyle(() => {
    if (animatedPosition.value < 1) {
      return {}
    } else {
      return {
        transform: [
          {
            translateX: -interpolate(animatedPosition.value, [2, 1], [halfWdith, 0])
          }
        ]
      }
    }
  }, [animatedPosition])

  const [data] = useState([
    {
      id: Math.random() + Date.now().toString(),
      payload: {
        text: Utility.getRandomSentenceWithDelay().text
      },
      isVoiceData: false
    },
    {
      id: Math.random() + Date.now().toString(),
      payload: Utility.getRandomSentenceWithDelay(),
      isVoiceData: true
    }
  ])
  const onPressheader = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(index ? 0 : 1)
  }, [index])

  const renderViewHandler = useCallback(() => {
    return (
      <TouchableOpacity activeOpacity={9} onPress={onPressheader}>
        <AnimatedLineargradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={animatedPosition.value !== 2 ? colors : transparencies}
          angle={91.48}
          animatedProps={animatedProps}
          style={styles.headerStyle}
        >
          <Animated.Text style={[styles.headerText, animatedOpacityStyle]}>
            {English.R100}
          </Animated.Text>
          <Animated.Image
            source={!index ? Images.up : Images.down}
            style={[styles.imageArrow, animatedTranslateStyle]}
          />
        </AnimatedLineargradient>
      </TouchableOpacity>
    )
  }, [index, transparencies, colors, animatedPosition.value])

  const renderItem = useCallback(({item}: any) => {
    return item?.isVoiceData ? (
      <VoiceDataItem data={item?.payload} />
    ) : (
      <VoiceTextItem data={item?.payload} />
    )
  }, [])

  return (
    <BottomSheet
      handleComponent={renderViewHandler}
      ref={bottomSheetRef}
      style={styles.bottomsheetStyle}
      onChange={setIndex}
      animatedIndex={animatedPosition}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          disappearsOnIndex={2}
          appearsOnIndex={1}
          onPress={onPressheader}
          pressBehavior={'collapse'}
          {...props}
        />
      )}
    >
      <FlatList
        keyExtractor={(item: any) => item?.id}
        renderItem={renderItem}
        initialNumToRender={2}
        windowSize={2}
        data={data}
        style={styles.flatlistStyle}
      />
    </BottomSheet>
  )
}

export default TransScriptBottomSheet

const styles = StyleSheet.create({
  headerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: scale(10),
    borderTopEndRadius: moderateScale(15),
    borderTopStartRadius: moderateScale(15),
    height: INPUT_HEIGHT
  },

  headerText: {
    flex: 1,
    fontFamily: Fonts.ThemeBold,
    fontSize: moderateScale(20),
    color: Colors.white
  },
  imageArrow: {
    width: verticalScale(15),
    height: verticalScale(15),
    tintColor: Colors.ThemeBorder
  },
  flatlistStyle: {
    width: '100%'
  },
  bottomsheetStyle: {
    overflow: 'hidden',
    borderTopEndRadius: moderateScale(15),
    borderTopStartRadius: moderateScale(15)
  }
})
