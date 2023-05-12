import React from 'react'
import {View} from 'react-native'
import styled from 'styled-components/native'

import AppButton from '../../../../Components/AppButton'
import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, verticalScale} from '../../../../Theme/Responsive'
import {PlanTabProps} from '../PremiumPlanScreen'
import PlanItem from './PlanItem'
import {InnerContainer, InnetTextContainer, PlanList, PlanTitle, TinyText} from './PlanTabBar'

const data = [English.R115, English.R116, English.R113]
const PlusPlan = ({onPress = () => {}}: PlanTabProps) => {
  return (
    <View style={[CommonStyles.centerItem, CommonStyles.flex]}>
      <InnerContainer>
        <BestValueImage source={Images.bestValueImage} />
        <InnetTextContainer>
          <TinyText>{English.R118}</TinyText>
          <PlanTitle>{English.R119}</PlanTitle>
        </InnetTextContainer>
        <PlanList
          data={data}
          scrollEnabled={false}
          renderItem={({item}: any) => <PlanItem item={item} />}
        />
        <AppButton onPress={onPress} title={English.R162} />
      </InnerContainer>
      <TermText>{English.R120}</TermText>
    </View>
  )
}

export default PlusPlan
const TermText = styled.Text`
  color: ${Colors.greyShade9C9D};
  font-size: ${moderateScale(16)}px;
  font-family: ${Fonts.ThemeMedium};
  position: absolute;
  bottom: 5%;
`
const BestValueImage = styled.Image`
  position: absolute;
  top: ${-verticalScale(11)}px;
  z-index: 1000;
  align-self: center;
`
