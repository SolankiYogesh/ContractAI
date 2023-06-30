import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import AnimatedTypeWriter from 'react-native-animated-typewriter'
import Animated, {FadeInDown} from 'react-native-reanimated'
import Sound from 'react-native-sound'
import _ from 'lodash'

import AppProfileIcon from '../../../../Components/AppProfileIcon'
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
  isSound?: boolean
}

const VoiceDataItem = ({
  data,
  onPlayBackStateChange = () => {},
  loading,
  isDisabled = false,
  onAnimationEnd = () => {},
  isSound = false
}: VoiceDataItemProps) => {
  const isCalled = useRef(false)

  const songCount = useRef(0)

  const onPlayBackChange = useCallback(
    async (state: boolean) => {
      if (isCalled.current && !state) {
        return
      }
      if (!state) {
        isCalled.current = true
      }

      onPlayBackStateChange(state)
    },
    [onPlayBackStateChange]
  )

  const init = useCallback(async () => {
    const ids = String(data?.voice_id)?.split(',')

    const tracks = _.map(ids, (i) => {
      return {
        url: Utility.getAudioFile(i)
      }
    })
    const filterTracks = _.filter(tracks, (i) => !!i.url)
    Sound.setCategory('Playback')

    if (songCount.current < filterTracks.length) {
      const sound = new Sound(filterTracks[songCount.current].url, (error) => {
        if (error) {
          onPlayBackChange(false)
        } else {
          sound.setVolume(1)

          sound.play((success) => {
            sound.release()
            if (songCount.current === filterTracks?.length - 1) {
              onPlayBackChange(false)
            }
            if (success) {
              songCount.current += 1
              init()
            } else {
              onPlayBackChange(false)
            }
          })
        }
      })
      onAnimationEnd(true)
      onPlayBackChange(true)
    } else {
      onPlayBackChange(false)
    }
  }, [data?.voice_id, onPlayBackChange, onAnimationEnd])

  const isTypingEnd = useMemo(() => !data?.voice_id || !isSound, [data?.voice_id, isSound])

  useEffect(() => {
    if (!isDisabled && data?.voice_id && isSound) {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.voice_id])

  return (
    <Animated.View
      entering={isDisabled ? undefined : FadeInDown.delay(200).springify()}
      style={styles.parentView}
    >
      <AppProfileIcon
        isImageLocal
        url={Images.Reeva}
        size={30}
        borderRadius={300}
        borderWidth={0}
      />

      <View style={styles.textContainer}>
        {isDisabled ? (
          <Text style={styles.animatedTextStyle}>{data?.text}</Text>
        ) : !loading && data?.text ? (
          <AnimatedTypeWriter
            containerStyle={styles.container}
            textStyle={styles.animatedTextStyle}
            text={data?.text}
            timeBetweenLetters={30}
            onTypingEnd={() => {
              onAnimationEnd(false)
              if (isTypingEnd) {
                onPlayBackChange(false)
              }
            }}
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
