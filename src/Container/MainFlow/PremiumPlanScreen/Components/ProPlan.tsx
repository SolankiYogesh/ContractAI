import React from 'react'
import {FlatList, View} from 'react-native'

import AppButton from '../../../../Components/AppButton'
import English from '../../../../Resources/Locales/English'
import {PlanTabProps, styles} from '../PremiumPlanScreen'
import PlanItem from './PlanItem'
import {InnerContainer, InnetTextContainer, PlanTitle, TinyText} from './PlanTabBar'

const data = [English.R115, English.R116, English.R113, English.R117]

const ProPlan = ({onPress = () => {}, isCurrentPlan = false}: PlanTabProps) => {
  return (
    <View style={styles.tabContainer}>
      <InnerContainer>
        <InnetTextContainer>
          <TinyText>{English.R118}</TinyText>
          <PlanTitle>{English.R192}</PlanTitle>
        </InnetTextContainer>
        <FlatList
          data={data}
          scrollEnabled={false}
          renderItem={({item}: any) => <PlanItem item={item} />}
        />
        <AppButton
          textStyle={isCurrentPlan ? styles.textStyle : {}}
          style={isCurrentPlan ? styles.buttonStyle : {}}
          onPress={onPress}
          isGradient={!isCurrentPlan}
          title={isCurrentPlan ? English.R114 : English.R162}
        />
      </InnerContainer>
    </View>
  )
}

export default ProPlan
