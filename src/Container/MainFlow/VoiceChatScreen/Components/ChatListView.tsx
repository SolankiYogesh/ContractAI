import React, {forwardRef, useMemo} from 'react'
import {FlatList, ScrollView, StyleSheet, View} from 'react-native'
import Animated, {FadeIn, FadeInLeft, FadeInRight, FadeOut} from 'react-native-reanimated'
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
        <Animated.View style={styles.rippleContainer} entering={FadeInRight.duration(500)}>
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
        <Animated.View style={styles.rippleContainer} entering={FadeInLeft.duration(500)}>
          <RippleAnimation size={W_HEIGHT * 0.2} isTop isReeva isAnimating={isPlaying} />
        </Animated.View>
      )
    }, [isPlaying])

    const lastItems = useMemo(() => _.slice(data, -2), [data])
    const remainingItems = useMemo(() => _.slice(data, 0, -2), [data])

    return (
      <ScrollView nestedScrollEnabled scrollEnabled={false}>
        <Animated.View exiting={FadeOut} entering={FadeIn.duration(500)} style={CommonStyles.flex}>
          {renderReevaVoiceView}
          <View style={[CommonStyles.flex, CommonStyles.centerItem]}>
            <ScrollView showsVerticalScrollIndicator={false} ref={ref} style={styles.flatlistStyle}>
              {_.map(remainingItems, (item: ChatDataType) => {
                item.isDisabled = true
                return renderItem({item})
              })}
              <FlatList
                data={lastItems}
                scrollEnabled={false}
                renderItem={renderItem}
                style={styles.listStyle}
                showsVerticalScrollIndicator={false}
              />
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
  listStyle: {
    height: heightPx(35),
    minHeight: heightPx(35)
  },

  rippleContainer: {
    minHeight: heightPx(20),
    ...CommonStyles.centerItem
  }
})
