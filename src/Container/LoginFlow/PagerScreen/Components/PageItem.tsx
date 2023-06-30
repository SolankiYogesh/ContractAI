import React from 'react'
import {Image} from 'react-native'
import styled from 'styled-components/native'

import {Colors} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, verticalScale, widthPx} from '../../../../Theme/Responsive'

const PageItem = ({item}: any) => {
  return (
    <Container>
      {item.id === 1 ? (
        <>
          <TitleText>{item?.title}</TitleText>
          <DescText>{item?.text}</DescText>
          <ImageContainer resizeMode={'contain'} source={item?.image} />
        </>
      ) : (
        <>
          <Image resizeMode={'contain'} source={item?.image} />
          <TitleText>{item?.title}</TitleText>
          <DescText>{item?.text}</DescText>
        </>
      )}
    </Container>
  )
}

export default PageItem

const Container = styled.View`
  width: ${widthPx(100)}px;
  align-self: center;
  align-content: center;
  margin-top: ${verticalScale(50)}px;
  height: 100%;
`

const ImageContainer = styled.Image`
  align-self: flex-end;
`

const TitleText = styled.Text`
  color: ${Colors.blackShade2A30};
  font-size: ${moderateScale(28)}px;
  font-family: ${Fonts.ThemeExtraBold};
  text-align: center;
  margin-top: ${verticalScale(20)}px;
  margin-bottom: ${verticalScale(20)}px;
  border-top: 1px solid #000;
`

const DescText = styled.Text`
  color: ${Colors.greyShade898C};
  font-size: ${moderateScale(12)}px;
  font-family: ${Fonts.ThemeMedium};
  text-align: center;
`
