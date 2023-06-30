import React, {memo, useMemo} from 'react'
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

  const renderBody = useMemo(() => {
    return isLoading ? (
      <View style={StyleSheet.absoluteFillObject}>
        <Skeleton>
          <Skeleton.Item width={verticalScale(50)} height={verticalScale(50)} borderRadius={4} />
        </Skeleton>
      </View>
    ) : (
      <InnerText adjustsFontSizeToFit numberOfLines={1} fontSize={fontSize}>
        {Utility.convert(text)}
      </InnerText>
    )
  }, [fontSize, isLoading, text])

  return (
    <LinearGradient
      colors={[Colors.purpleShade8A63, Colors.purpleShadeB090]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      angle={91.48}
      style={[containerStyle, style]}
    >
      {renderBody}
    </LinearGradient>
  )
}

export default memo(TextToImage)

const InnerText = styled.Text`
  font-size: ${(props: any) =>
    props?.fontSize ? moderateScale(props?.fontSize) : moderateScale(18)}px;
  font-family: ${Fonts.ThemeSemiBold};
  color: ${Colors.ThemeColor};
`
