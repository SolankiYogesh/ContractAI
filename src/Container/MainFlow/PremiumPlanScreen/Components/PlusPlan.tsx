import React from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import styled from 'styled-components/native'

import AppButton from '../../../../Components/AppButton'
import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import {heightPx, verticalScale} from '../../../../Theme/Responsive'
import {PlanTabProps} from '../PremiumPlanScreen'
import PlanItem from './PlanItem'
import {InnerContainer, InnetTextContainer, PlanTitle, TinyText} from './PlanTabBar'

const data = [English.R115, English.R116, English.R113]
const PlusPlan = ({onPress = () => {}, isCurrentPlan = false}: PlanTabProps) => {
  return (
    <View style={styles.tabContainer}>
      <InnerContainer>
        <BestValueImage source={Images.bestValueImage} />
        <InnetTextContainer>
          <TinyText>{English.R118}</TinyText>
          <PlanTitle>{English.R191}</PlanTitle>
        </InnetTextContainer>
        <FlatList
          data={data}
          scrollEnabled={false}
          renderItem={({item}: any) => <PlanItem item={item} />}
        />

        <AppButton
          disabled={isCurrentPlan}
          textStyle={isCurrentPlan ? styles.textStyle : {}}
          style={isCurrentPlan ? styles.buttonStyle : {}}
          onPress={onPress}
          disabledColors={[Colors.white]}
          isGradient={!isCurrentPlan}
          title={isCurrentPlan ? English.R114 : English.R162}
        />
      </InnerContainer>
    </View>
  )
}

export default PlusPlan

const BestValueImage = styled.Image`
  position: absolute;
  top: ${-verticalScale(11)}px;
  z-index: 1000;
  align-self: center;
`
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
