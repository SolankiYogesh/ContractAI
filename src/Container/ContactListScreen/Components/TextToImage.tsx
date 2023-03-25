import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import _ from 'lodash'
import styled from 'styled-components/native'

import {Colors} from '../../../Theme'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'

const TextToImage = ({text = '', style = {}}) => {
  const words = _.filter(text.split(' ').slice(0, 2), (i) => !!i || i !== 'undefined')

  const firstLetters = words.map((word) => word.charAt(0).toUpperCase()).join('')

  const containerStyle = {
    width: verticalScale(50),
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(15),
    borderRadius: moderateScale(15)
  }

  return (
    <LinearGradient
      colors={[Colors.purpleShade8A63, Colors.purpleShadeB090]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      angle={91.48}
      style={[containerStyle, style]}
    >
      <InnerText>{firstLetters}</InnerText>
    </LinearGradient>
  )
}

export default TextToImage

const InnerText = styled.Text`
  font-size: ${moderateScale(20)}px;
  font-family: ${Fonts.ThemeSemiBold};
  color: ${Colors.ThemeColor};
`
