import React from 'react'
import {View} from 'react-native'
import styled from 'styled-components/native'

import English from '../Resources/Locales/English'
import {Colors} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyles'
import {Fonts} from '../Theme/Fonts'
import {moderateScale} from '../Theme/Responsive'

interface EmptyComponentProps {
  title?: string
}

const EmptyComponent = (props: EmptyComponentProps) => {
  return (
    <View style={[CommonStyles.flex, CommonStyles.centerItem]}>
      <NoDataFoundText>{props?.title ?? English.R181}</NoDataFoundText>
    </View>
  )
}

export default EmptyComponent
const NoDataFoundText = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.greyShade414};
`
