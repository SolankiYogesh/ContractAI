import React, {memo, useCallback, useEffect} from 'react'
import {Image, Platform, StyleSheet, Text, View} from 'react-native'
import AnimatedTypeWriter from 'react-native-animated-typewriter'
import Animated, {FadeInDown} from 'react-native-reanimated'
import TrackPlayer, {Event, Track, useTrackPlayerEvents} from 'react-native-track-player'
import _, {debounce} from 'lodash'

import {Colors, Images} from '../../../../Theme'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'
import ReevaTyping from './ReevaTyping'

interface VoiceDataItemProps {
  data?: any
  onPlayBackStateChange?: (state: boolean) => void
  loading?: boolean
  isDisabled?: boolean
  onAnimationEnd?: (state: boolean) => void
}

const VoiceDataItem = ({
  data,
  onPlayBackStateChange = () => {},
  loading,
  isDisabled = false,
  onAnimationEnd = () => {}
}: VoiceDataItemProps) => {
  const events = [Event.PlaybackQueueEnded]

  const playeBack = useCallback(
    (value: boolean) => {
      onPlayBackStateChange(value)
    },
    [onPlayBackStateChange]
  )

  const debouncePlayerBack = debounce((value: boolean) => playeBack(value), 1000)

  useTrackPlayerEvents(events, async (e) => {
    if (e.type === Event.PlaybackQueueEnded && data?.voice_id && Platform.OS === 'android') {
      TrackPlayer.reset()
      debouncePlayerBack(false)
    }
  })

  const init = useCallback(async () => {
    const ids = String(data?.voice_id)?.split(',')

    const tracks: Track[] = _.map(ids, (i) => {
      return {
        url: Utility.getAudioFile(i), // Load media from the network
        title: 'Reeva',
        artist: 'Reeva',
        album: 'Reeva',
        genre: 'Reeva'
      }
    })
    const filterTracks = _.filter(tracks, (i) => !!i.url)

    TrackPlayer.reset()
    await TrackPlayer.add(filterTracks)
    await TrackPlayer.play()
    onAnimationEnd(true)
    debouncePlayerBack(true)
  }, [data?.voice_id, debouncePlayerBack, onAnimationEnd])

  useEffect(() => {
    if (!isDisabled && data?.voice_id) {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.voice_id])

  return (
    <Animated.View
      entering={isDisabled ? undefined : FadeInDown.delay(200).springify()}
      style={styles.parentView}
    >
      <Image source={Images.Reeva} style={styles.profileImage} resizeMode={'cover'} />

      {/* <Triangle styles={styles.triangleView} color={Colors.lightPurple} size={verticalScale(10)} /> */}

      <View style={styles.textContainer}>
        {isDisabled ? (
          <Text style={styles.animatedTextStyle}>{data?.text}</Text>
        ) : !loading && data?.text ? (
          <AnimatedTypeWriter
            containerStyle={styles.container}
            textStyle={styles.animatedTextStyle}
            text={data?.text}
            onTypingEnd={() => {
              onAnimationEnd(false)
              if (!data?.voice_id || Platform.OS === 'ios') {
                debouncePlayerBack(false)
              }
            }}
            timeBetweenLetters={30}
          />
        ) : (
          <ReevaTyping />
        )}
      </View>
    </Animated.View>
  )
}

export default memo(VoiceDataItem)

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: Colors.lightPurple,
    padding: scale(10),
    borderTopEndRadius: moderateScale(10),
    borderBottomEndRadius: moderateScale(10),
    borderTopStartRadius: moderateScale(10),
    marginLeft: scale(5)
  },

  container: {
    backgroundColor: Colors.lightPurple,
    borderColor: Colors.lightPurple
  },
  animatedTextStyle: {
    fontSize: moderateScale(14),
    color: Colors.blackShade2A30,
    textAlign: 'left',
    fontWeight: 'normal'
  },
  profileImage: {
    width: verticalScale(30),
    height: verticalScale(30),
    borderRadius: moderateScale(300)
  },
  parentView: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginLeft: scale(20),
    minWidth: '20%',
    marginVertical: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center'
  }
})
