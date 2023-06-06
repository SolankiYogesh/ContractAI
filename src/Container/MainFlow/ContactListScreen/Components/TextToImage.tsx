import React from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Skeleton from '@thevsstech/react-native-skeleton'
import styled from 'styled-components/native'

import {Colors} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'

interface TextToImageProps {
  text?: string
  style?: StyleProp<ViewStyle>
  isLoading?: boolean
  fontSize?: number
}

const TextToImage = (props: TextToImageProps) => {
  const {text = '', style = {}, isLoading = false, fontSize} = props
  const containerStyle: any = {
    width: verticalScale(45),
    height: verticalScale(45),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(5),
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
      {isLoading && (
        <View style={StyleSheet.absoluteFillObject}>
          <Skeleton>
            <Skeleton.Item width={verticalScale(50)} height={verticalScale(50)} borderRadius={4} />
          </Skeleton>
        </View>
      )}
      {!isLoading && <InnerText fontSize={fontSize}>{Utility.convert(text)}</InnerText>}
    </LinearGradient>
  )
}

export default TextToImage

const InnerText = styled.Text`
  font-size: ${(props: any) =>
    props?.fontSize ? moderateScale(props?.fontSize) : moderateScale(18)}px;
  font-family: ${Fonts.ThemeSemiBold};
  color: ${Colors.ThemeColor};
`
