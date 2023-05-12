import React, {memo, useCallback, useEffect, useState} from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import AnimatedTypeWriter from 'react-native-animated-typewriter'
import Sound from 'react-native-sound'
import Lottie from 'lottie-react-native'

import Triangle from '../../../../Components/Traingle'
import {Colors, Images} from '../../../../Theme'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'

const VoiceDataItem = ({
  data,
  onPlayBackStateChange = () => {},
  loading,
  isDisabled = false
}: any) => {
  const [isLoading, setISLoading] = useState(false)

  const init = useCallback(() => {
    Sound.setCategory('Playback')
    const track = new Sound(data?.audio, null, (e) => {
      track.setVolume(1)
      track.play(() => {
        onPlayBackStateChange(false)
      })
      setISLoading(true)
      onPlayBackStateChange(true)
    })
  }, [data?.audio, onPlayBackStateChange])

  useEffect(() => {
    if (!isDisabled) {
      init()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.parentView}>
      <Image
        source={{
          uri: 'https://i.ibb.co/Fxy24b5/ola.png'
        }}
        style={styles.profileImage}
        resizeMode={'cover'}
      />
      <Triangle styles={styles.triangleView} color={Colors.lightPurple} size={verticalScale(10)} />

      <View style={styles.textContainer}>
        {isDisabled ? (
          <Text style={styles.animatedTextStyle}>{data?.text}</Text>
        ) : isLoading || !!loading ? (
          <AnimatedTypeWriter
            containerStyle={styles.container}
            textStyle={styles.animatedTextStyle}
            text={data?.text}
            timeBetweenLetters={30}
          />
        ) : (
          <Lottie
            style={styles.loaderStyle}
            autoPlay
            source={Images.loader}
            loop
            autoSize
            speed={1}
          />
        )}
      </View>
    </View>
  )
}

export default memo(VoiceDataItem)

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: Colors.lightPurple,
    padding: scale(10),
    borderTopEndRadius: moderateScale(10),
    borderBottomEndRadius: moderateScale(10),
    borderBottomStartRadius: moderateScale(10),
    marginLeft: scale(5)
  },

  container: {
    backgroundColor: Colors.lightPurple,
    borderColor: Colors.lightPurple
  },
  animatedTextStyle: {
    fontSize: moderateScale(15),
    color: Colors.blackShade2A30,
    textAlign: 'left',
    fontWeight: 'normal'
  },
  profileImage: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: moderateScale(300)
  },
  parentView: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginLeft: scale(20),
    minWidth: '20%'
  },

  loaderStyle: {
    width: '80%',
    height: verticalScale(30)
  },
  triangleView: {
    marginLeft: scale(15)
  }
})
