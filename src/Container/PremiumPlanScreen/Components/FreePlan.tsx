import React from 'react'
import {View} from 'react-native'

import AppButton from '../../../Components/AppButton'
import English from '../../../Resources/Locales/English'
import {Colors} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import PlanItem from './PlanItem'
import {InnerContainer, PlanList, PlanTitle} from './PlanTabBar'

const data = [English.R111, English.R112, English.R113]

const FreePlan = () => {
  return (
    <View style={[CommonStyles.centerItem, CommonStyles.flex]}>
      <InnerContainer>
        <PlanTitle isSpace>{English.R108}</PlanTitle>
        <PlanList data={data} renderItem={({item}: any) => <PlanItem item={item} />} />
        <AppButton
          textStyle={textStyle}
          style={buttonStyle}
          isGradient={false}
          title={English.R114}
        />
      </InnerContainer>
    </View>
  )
}

export default FreePlan

const buttonStyle = {
  borderWidth: 2,
  borderColor: Colors.ThemeColor
}

const textStyle = {
  color: Colors.ThemeColor
}
