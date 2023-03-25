import React from 'react'
import {View} from 'react-native'

import AppButton from '../../../Components/AppButton'
import English from '../../../Resources/Locales/English'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {PlanTabProps} from '../PremiumPlanScreen'
import PlanItem from './PlanItem'
import {InnerContainer, InnetTextContainer, PlanList, PlanTitle, TinyText} from './PlanTabBar'

const data = [English.R115, English.R116, English.R113, English.R117]
const PlusPlan = ({onPress = () => {}}: PlanTabProps) => {
  return (
    <View style={[CommonStyles.centerItem, CommonStyles.flex]}>
      <InnerContainer>
        <InnetTextContainer>
          <TinyText>{English.R118}</TinyText>
          <PlanTitle>{English.R119}</PlanTitle>
        </InnetTextContainer>
        <PlanList data={data} renderItem={({item}: any) => <PlanItem item={item} />} />
        <AppButton onPress={onPress} title={English.R114} />
      </InnerContainer>
    </View>
  )
}

export default PlusPlan
