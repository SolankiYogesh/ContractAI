import React from 'react'
import {FlatList, StyleSheet, View} from 'react-native'

import AppButton from '../../../../Components/AppButton'
import English from '../../../../Resources/Locales/English'
import {Colors} from '../../../../Theme'
import {heightPx, verticalScale} from '../../../../Theme/Responsive'
import {PlanTabProps} from '../PremiumPlanScreen'
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
const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    height: heightPx(80),
    width: '100%'
  },
  buttonStyle: {
    borderWidth: 2,
    borderColor: Colors.ThemeColor
  },

  textStyle: {
    color: Colors.ThemeColor
  }
})
