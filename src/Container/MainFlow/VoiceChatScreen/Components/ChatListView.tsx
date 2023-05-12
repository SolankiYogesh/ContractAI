import React, {forwardRef, useMemo} from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import Animated, {FadeIn, FadeInLeft, FadeInRight, FadeOut} from 'react-native-reanimated'
import {useSelector} from 'react-redux'
import _ from 'lodash'

import RippleAnimation from '../../../../Components/RippleAnimation'
import {Colors} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {W_HEIGHT} from '../../../../Theme/Responsive'

interface ChatListViewProps {
  isRecording: boolean
  isPlaying: boolean
  data: any[]
  renderItem: any
}

const ChatListView = forwardRef(
  ({isRecording, isPlaying, data, renderItem}: ChatListViewProps, ref: any) => {
    const user = useSelector((state: any) => state?.user?.userData)
    const renderUserVoiceView = useMemo(() => {
      return (
        <Animated.View entering={FadeInRight.duration(500)}>
          <RippleAnimation
            isAnimating={isRecording}
            imageUrl={user?.profile_image || 'https://i.ibb.co/5nRvPXV/User.png'}
            color={Colors.greyShade9B9}
            size={W_HEIGHT * 0.2}
          />
        </Animated.View>
      )
    }, [isRecording, user?.profile_image])

    const renderReevaVoiceView = useMemo(() => {
      return (
        <Animated.View entering={FadeInLeft.duration(500)}>
          <RippleAnimation
            size={W_HEIGHT * 0.2}
            isTop
            isAnimating={isPlaying}
            imageUrl={'https://i.ibb.co/Fxy24b5/ola.png'}
          />
        </Animated.View>
      )
    }, [isPlaying])

    return (
      <Animated.View exiting={FadeOut} entering={FadeIn.duration(500)} style={CommonStyles.flex}>
        {renderReevaVoiceView}
        <View style={[CommonStyles.flex, CommonStyles.centerItem]}>
          <FlatList
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
            initialNumToRender={2}
            windowSize={2}
            data={_.slice(data, -2)}
            ref={ref}
            style={styles.flatlistStyle}
          />
        </View>
        {renderUserVoiceView}
      </Animated.View>
    )
  }
)
export default ChatListView

const styles = StyleSheet.create({
  flatlistStyle: {
    width: '100%'
  }
})
