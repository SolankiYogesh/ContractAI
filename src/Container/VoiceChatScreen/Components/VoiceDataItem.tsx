import React, {memo, useEffect, useState} from 'react'
import {Image, StyleSheet, View} from 'react-native'
import AnimatedTypeWriter from 'react-native-animated-typewriter'
import Sound from 'react-native-sound'
import Lottie from 'lottie-react-native'

import Triangle from '../../../Components/Traingle'
import {Colors} from '../../../Theme'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'

const VoiceDataItem = ({data, onPlayBackStateChange = () => {}}: any) => {
  const [isLoading, setISLoading] = useState(false)

  // useEffect(() => {
  //   const track = new Sound(data?.audio, undefined, (e) => {
  //     track.play(() => {
  //       onPlayBackStateChange(false)
  //     })
  //     setISLoading(true)
  //     onPlayBackStateChange(true)
  //   })
  // }, [])

  return (
    <View style={styles.parentView}>
      <Image
        source={{
          uri: 'https://i.ibb.co/zPxNX46/Reeva.png'
        }}
        style={styles.profileImage}
        resizeMode={'cover'}
      />
      <Triangle styles={styles.triangleView} color={Colors.lightPurple} size={verticalScale(10)} />

      <View style={styles.textContainer}>
        {isLoading ? (
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
            source={require('../../../Resources/Animations/loader.json')}
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
    width: '80%',
    alignSelf: 'flex-start',
    marginLeft: scale(5)
  },

  loaderStyle: {
    width: '80%',
    height: verticalScale(30)
  },
  triangleView: {
    marginLeft: scale(15)
  }
})
