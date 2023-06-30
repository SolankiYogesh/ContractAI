import React, {memo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Animated, {FadeInDown} from 'react-native-reanimated'
import {useSelector} from 'react-redux'

import AppProfileImage from '../../../../Components/AppProfileIcon'
import {Colors} from '../../../../Theme'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'

const VoiceTextItem = ({data, isDisabled = false}: any) => {
  const user = useSelector((state: any) => state?.user?.userData)
  return (
    <Animated.View
      entering={isDisabled ? undefined : FadeInDown.delay(200)}
      style={styles.parentView}
    >
      <AppProfileImage
        style={styles.profileImage}
        borderWidth={0}
        borderRadius={300}
        url={user?.profile_image}
        size={30}
        fontSize={moderateScale(15)}
      />

      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>{data?.text}</Text>
      </View>
    </Animated.View>
  )
}

export default memo(VoiceTextItem)

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: Colors.greyShadeDDD,
    padding: scale(10),
    borderTopLeftRadius: moderateScale(10),
    borderBottomStartRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    marginRight: scale(5)
  },
  profileImage: {
    alignSelf: 'flex-end'
  },
  parentView: {
    alignSelf: 'flex-end',
    marginLeft: scale(20),
    maxWidth: '80%',
    minWidth: '20%',
    marginVertical: verticalScale(5),
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: moderateScale(14),
    color: Colors.blackShade2A30
  }
})
