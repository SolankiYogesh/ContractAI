import React from 'react'
import styled from 'styled-components/native'

import {Colors} from '../../../Theme'
import {Fonts} from '../../../Theme/Fonts'
import {heightPx, moderateScale, scale, verticalScale, widthPx} from '../../../Theme/Responsive'

const PageItem = ({item}: any) => {
  return (
    <Container>
      <ImageContainer resizeMode={'contain'} source={item?.image} />
      <TitleText>{item?.title}</TitleText>
      <DescText>{item?.text}</DescText>
    </Container>
  )
}

export default PageItem

const Container = styled.View`
  width: ${widthPx(100)}px;
  height: ${heightPx(85)}px;
  padding-left: ${scale(20)}px;
  padding-right: ${scale(20)}px;
`

const ImageContainer = styled.Image`
  height: 60%;
  width: 100%;
`

const TitleText = styled.Text`
  color: ${Colors.blackShade2A30}px;
  font-size: ${moderateScale(28)}px;
  font-family: ${Fonts.ThemeExtraBold};
  text-align: center;
  margin-top: ${verticalScale(20)}px;
  margin-bottom: ${verticalScale(20)}px;
`

const DescText = styled.Text`
  color: ${Colors.greyShade898C};
  font-size: ${moderateScale(12)}px;
  font-family: ${Fonts.ThemeMedium};
  text-align: center;
`
