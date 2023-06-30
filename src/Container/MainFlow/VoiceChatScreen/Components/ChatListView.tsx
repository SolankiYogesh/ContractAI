import React, {forwardRef, useMemo} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight
} from 'react-native-reanimated'
import _ from 'lodash'

import RippleAnimation from '../../../../Components/RippleAnimation'
import {Colors} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {heightPx, verticalScale, W_HEIGHT} from '../../../../Theme/Responsive'
import {ChatDataType} from '../../../../types/Types'

interface ChatListViewProps {
  isRecording: boolean
  isPlaying: boolean
  data: ChatDataType[]
  renderItem: any
}

const ChatListView = forwardRef<ScrollView, ChatListViewProps>(
  ({isRecording, isPlaying, data, renderItem}: ChatListViewProps, ref) => {
    const renderUserVoiceView = useMemo(() => {
      return (
        <Animated.View
          style={styles.rippleContainer}
          entering={FadeInRight.duration(500).springify().delay(500)}
          exiting={FadeOutLeft.duration(500).springify().delay(500)}
        >
          <RippleAnimation
            isAnimating={isRecording}
            color={Colors.greyShade9B9}
            size={W_HEIGHT * 0.2}
          />
        </Animated.View>
      )
    }, [isRecording])

    const renderReevaVoiceView = useMemo(() => {
      return (
        <Animated.View
          style={styles.rippleContainer}
          entering={FadeInLeft.duration(500).springify().delay(500)}
          exiting={FadeOutRight.duration(500).springify().delay(500)}
        >
          <RippleAnimation size={W_HEIGHT * 0.2} isTop isReeva isAnimating={isPlaying} />
        </Animated.View>
      )
    }, [isPlaying])

    return (
      <ScrollView scrollEnabled={false} nestedScrollEnabled>
        <Animated.View
          exiting={FadeOut.duration(500).springify().delay(500)}
          entering={FadeIn.duration(500).springify().delay(500)}
          style={CommonStyles.flex}
        >
          {renderReevaVoiceView}
          <View style={[CommonStyles.flex, CommonStyles.centerItem]}>
            <ScrollView
              ref={ref}
              contentContainerStyle={[styles.contentContainerStyle]}
              style={styles.flatlistStyle}
              showsVerticalScrollIndicator={false}
            >
              {_.map(_.reverse([...data]), (i) => {
                return renderItem({item: i})
              })}
            </ScrollView>
          </View>
          {renderUserVoiceView}
        </Animated.View>
      </ScrollView>
    )
  }
)
export default ChatListView

const styles = StyleSheet.create({
  flatlistStyle: {
    width: '100%',
    ...CommonStyles.flex,
    marginVertical: verticalScale(20),
    height: heightPx(30),
    minHeight: heightPx(35)
  },

  contentContainerStyle: {
    flexDirection: 'column-reverse',
    paddingBottom: verticalScale(80)
  },
  rippleContainer: {
    minHeight: heightPx(20),
    ...CommonStyles.centerItem
  }
})
