import React from 'react'
import {FlatList, View} from 'react-native'

import AppButton from '../../../../Components/AppButton'
import English from '../../../../Resources/Locales/English'
import {PlanTabProps, styles} from '../PremiumPlanScreen'
import PlanItem from './PlanItem'
import {InnerContainer, PlanTitle} from './PlanTabBar'

const data = [English.R111, English.R112, English.R113]

const FreePlan = ({isCurrentPlan}: PlanTabProps) => {
  return (
    <View style={styles.tabContainer}>
      <InnerContainer>
        <PlanTitle isSpace>{English.R108}</PlanTitle>
        <FlatList
          data={data}
          scrollEnabled={false}
          renderItem={({item}: any) => <PlanItem item={item} />}
        />
        {isCurrentPlan && (
          <AppButton
            textStyle={styles.textStyle}
            style={styles.buttonStyle}
            isGradient={false}
            title={English.R114}
          />
        )}
      </InnerContainer>
    </View>
  )
}

export default FreePlan
