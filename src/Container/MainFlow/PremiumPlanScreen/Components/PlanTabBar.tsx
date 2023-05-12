import React from 'react'
import {TabBar} from 'react-native-tab-view'
import styled from 'styled-components/native'

import {Colors} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'

const PlanTabBar = (props: any) => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: Colors.ThemeColor}}
      style={{backgroundColor: Colors.white}}
      activeColor={Colors.ThemeColor}
      inactiveColor={Colors.greyShadeB4B6}
      labelStyle={labelStyle}
    />
  )
}

export default PlanTabBar
export const InnerContainer = styled.View`
  border-width: 2px;
  border-color: ${Colors.ThemeColor};
  width: 80%;
  height: 75%;
  border-radius: ${moderateScale(20)}px;
  padding: ${scale(5)}px;
`

export const PlanTitle = styled.Text`
  font-family: ${Fonts.ThemeExtraBold};
  color: ${Colors.blackShade2A30};
  font-size: ${moderateScale(45)}px;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${(props: any) => (props?.isSpace ? verticalScale(30) : 0)}px;
  margin-top: ${(props: any) => (props?.isSpace ? verticalScale(30) : 0)}px;
`
export const PlanList = styled.FlatList``
export const TinyText = styled.Text`
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.blackShade2A30};
  font-size: ${moderateScale(15)}px;
`
export const InnetTextContainer = styled.View`
  flex-direction: row;
  align-self: center;
  margin-bottom: ${verticalScale(30)}px;
  margin-top: ${verticalScale(30)}px;
`
export const SheetInnetText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  color: ${Colors.blackShade2A30};
  font-size: ${moderateScale(15)}px;
`

const labelStyle = {
  textTransform: 'capitalize',
  fontSize: moderateScale(16),
  fontFamily: Fonts.ThemeMedium
}
