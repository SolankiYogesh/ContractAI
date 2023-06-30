import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from '@gorhom/bottom-sheet'
import _ from 'lodash'
import {v4 as uuid} from 'uuid'

import APICall from '../../../../APIRequest/APICall'
import EndPoints from '../../../../APIRequest/EndPoints'
import EmptyComponent from '../../../../Components/EmptyComponent'
import English from '../../../../Resources/Locales/English'
import {Colors, Constant, Images} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {Fonts} from '../../../../Theme/Fonts'
import {
  heightPx,
  INPUT_HEIGHT,
  moderateScale,
  scale,
  verticalScale,
  widthPx
} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'
import VoiceDataItem from './VoiceDataItem'
import VoiceTextItem from './VoiceTextItem'

interface TransScriptBottomSheetProps {
  data?: any[]
  contract?: any
}

const TransScriptBottomSheet = ({contract = null}: TransScriptBottomSheetProps) => {
  const snapPoints = useMemo(() => [INPUT_HEIGHT, heightPx(50), heightPx(92)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [index, setIndex] = useState(0)
  const animatedPosition = useSharedValue(0)
  const halfWdith = widthPx(45)
  const [data, setData] = useState<any[]>([])
  const AnimatedLineargradient = Constant.isAndroid
    ? LinearGradient
    : Animated.createAnimatedComponent(LinearGradient)

  const getTranscription = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }

    if (contract?.cache_id) {
      const url = EndPoints.getChat.replace('ID', contract?.cache_id)

      APICall('get', {}, url)
        .then((resp: any) => {
          if (resp?.status === 200 && resp?.data) {
            const mapData: any[] = _.map(resp?.data?.messages, (i) => {
              return {
                ...i,
                isMe: i?.username === 'reeva',
                text: i?.transcript,
                id: uuid()
              }
            })
            setData(mapData)
          }
        })
        .catch((e) => {
          Utility.showAlert(String(e?.data?.message))
        })
    }
  }, [contract])

  useEffect(() => {
    getTranscription()
  }, [getTranscription])

  const colors = useMemo(() => [Colors.purpleShad8A, Colors.purpleShadB0], [])
  const transparencies = useMemo(() => [Colors.white, Colors.white], [])
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
  }, [animatedPosition.value, colors, transparencies])

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedPosition.value, [1, 2], [1, 0])
    }
  }, [animatedPosition.value])

  const animatedTranslateStyle = useAnimatedStyle(() => {
    if (!(animatedPosition.value <= 1)) {
      return {
        transform: [
          {
            translateX: -interpolate(animatedPosition.value, [2, 1], [halfWdith, 0])
          },
          {
            rotate: `180deg`
          }
        ],
        tintColor: interpolateColor(
          animatedPosition.value,
          [2, 1],
          [Colors.ThemeColor, Colors.white]
        )
      }
    } else {
      return {
        transform: [
          {
            rotate: `${interpolate(animatedPosition.value, [1, 0], [180, 0])}deg`
          }
        ]
      }
    }
  }, [animatedPosition.value])

  const onPressheader = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(index ? 0 : 1)
  }, [index])

  const renderViewHandler = useCallback(() => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPressheader}>
        <AnimatedLineargradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          angle={91.48}
          colors={animatedPosition.value < 2 ? colors : transparencies}
          animatedProps={animatedProps}
          style={styles.headerStyle}
        >
          <Animated.Text style={[styles.headerText, animatedOpacityStyle]}>
            {English.R100}
          </Animated.Text>
          <Animated.Image source={Images.up} style={[styles.imageArrow, animatedTranslateStyle]} />
        </AnimatedLineargradient>
      </TouchableOpacity>
    )
  }, [
    onPressheader,
    AnimatedLineargradient,
    animatedPosition.value,
    colors,
    transparencies,
    animatedProps,
    animatedOpacityStyle,
    animatedTranslateStyle
  ])

  const renderItem = useCallback(({item}: any) => {
    return item?.isMe ? (
      <VoiceDataItem isDisabled data={item} />
    ) : (
      <VoiceTextItem isDisabled data={item} />
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
      containerStyle={[CommonStyles.flex]}
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
      <BottomSheetFlatList
        keyExtractor={(item: any) => item?.id}
        renderItem={renderItem}
        initialNumToRender={2}
        windowSize={2}
        bounces={false}
        ListEmptyComponent={() => <EmptyComponent />}
        contentContainerStyle={data.length === 0 && CommonStyles.flex}
        showsVerticalScrollIndicator={false}
        data={data}
        style={[CommonStyles.flex, styles.flatlistStyle]}
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
    tintColor: Colors.white
  },
  flatlistStyle: {
    width: '100%',
    marginVertical: verticalScale(20)
  },
  bottomsheetStyle: {
    overflow: 'hidden',
    borderTopEndRadius: moderateScale(15),
    borderTopStartRadius: moderateScale(15),
    flex: 1
  }
})
