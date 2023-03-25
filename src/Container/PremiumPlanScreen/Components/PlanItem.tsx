import React from 'react'
import styled from 'styled-components/native'

import BackButton from '../../../Components/BackButton'
import {Colors, Images} from '../../../Theme'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'

const PlanItem = ({item}: any) => {
  const styles = {
    width: verticalScale(25),
    height: verticalScale(25),
    marginHorizontal: scale(15)
  }

  return (
    <PlanItemContainer>
      <BackButton isHeader style={styles} image={Images.right} />
      <PlatText>{item}</PlatText>
    </PlanItemContainer>
  )
}

export default PlanItem

const PlatText = styled.Text`
  color: ${Colors.greyShade9C9D};
  font-size: ${moderateScale(14)}px;
  font-family: ${Fonts.ThemeMedium};
  flex: 1;
`
const PlanItemContainer = styled.View`
  flex-direction: row;
  margin: ${verticalScale(10)}px;
  align-items: center;
`
