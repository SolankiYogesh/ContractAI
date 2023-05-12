import React from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import {useSelector} from 'react-redux'

import Triangle from '../../../../Components/Traingle'
import {Colors} from '../../../../Theme'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'

const VoiceTextItem = ({data}: any) => {
  const user = useSelector((state: any) => state?.user?.userData)
  return (
    <View style={styles.parentView}>
      <Image
        source={{
          uri: user?.profile_image || 'https://i.ibb.co/5nRvPXV/User.png'
        }}
        style={styles.profileImage}
        resizeMode={'cover'}
      />
      <Triangle styles={styles.triangleView} color={Colors.greyShadeDDD} size={verticalScale(10)} />

      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>{data?.text}</Text>
      </View>
    </View>
  )
}

export default VoiceTextItem

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: Colors.greyShadeDDD,
    padding: scale(10),
    borderTopLeftRadius: moderateScale(10),
    borderBottomEndRadius: moderateScale(10),
    borderBottomStartRadius: moderateScale(10)
  },
  profileImage: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: moderateScale(300),
    alignSelf: 'flex-end'
  },
  parentView: {
    alignSelf: 'flex-end',
    marginRight: scale(20),
    maxWidth: '80%',
    minWidth: '20%',
    justifyContent: 'flex-end'
  },
  textStyle: {
    fontSize: moderateScale(14),
    color: Colors.blackShade2A30
  },
  triangleView: {
    marginRight: scale(15),
    alignSelf: 'flex-end'
  }
})
