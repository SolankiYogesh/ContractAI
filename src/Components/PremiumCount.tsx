import React from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import styled from 'styled-components/native'

import {Colors, Images} from '../Theme'
import {CommonStyles, GettingText} from '../Theme/CommonStyles'
import {moderateScale, scale} from '../Theme/Responsive'

interface PremiumCountProps {
  total: number
  current: number
  style?: StyleProp<ViewStyle>
}

const PremiumCount = ({total, current, style = {}}: PremiumCountProps) => {
  return (
    <View style={[CommonStyles.rowView, style, styles.rowContractContainer]}>
      <GettingText
        color={Colors.blackShade236}
        marginBottom={0.2}
        marginRight={scale(20)}
        fontsize={moderateScale(13)}
      >
        {current + '/' + (total === 1000 ? '∞' : total)}
      </GettingText>

      <Image source={Images.contract} />
    </View>
  )
}

export default PremiumCount

const styles = StyleSheet.create({
  rowContractContainer: {
    backgroundColor: Colors.purpleShad887e,
    borderRadius: moderateScale(7),
    padding: scale(5)
  }
})
const Image = styled.Image`
  margin-left: -10px;
`
