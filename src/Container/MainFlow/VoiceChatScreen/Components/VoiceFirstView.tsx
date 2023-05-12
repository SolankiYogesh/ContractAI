import React from 'react'
import {StyleSheet} from 'react-native'
import {useSelector} from 'react-redux'
import styled from 'styled-components/native'

import {CreateAnAccountText, GettingText} from '../../../../CommonStyle/AuthContainer'
import AppButton from '../../../../Components/AppButton'
import RippleAnimation from '../../../../Components/RippleAnimation'
import English from '../../../../Resources/Locales/English'
import {Colors} from '../../../../Theme'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'

interface VoiceFirstViewProps {
  viewIndex: number
  onPressReset?: () => void
}

const VoiceFirstView = ({viewIndex, onPressReset = () => {}}: VoiceFirstViewProps) => {
  const user = useSelector((state: any) => state?.user?.userData)
  return (
    <FirstContainer>
      <GettingText
        fontsize={moderateScale(24)}
        marginHorizontal={scale(20)}
        top={verticalScale(30)}
        isTopMargin
      >
        {English.R179 + user?.first_name}
      </GettingText>
      <CreateAnAccountText marginHorizontal={scale(20)}>
        {English.R98 + Utility.getTimeString()}
      </CreateAnAccountText>
      <RippleAnimation isTop size={200} imageUrl={'https://i.ibb.co/Fxy24b5/ola.png'} />
      <GettingText isCenter>{English.R97}</GettingText>
      <CreateAnAccountText isCenter>
        {viewIndex === 0 ? English.R121 : English.R122}
      </CreateAnAccountText>
      {viewIndex === 2 && (
        <AppButton
          textStyle={styles.textStyle}
          style={styles.buttonStyle}
          onPress={onPressReset}
          isGradient={false}
          title={English.R99}
        />
      )}
    </FirstContainer>
  )
}

export default VoiceFirstView

const styles = StyleSheet.create({
  buttonStyle: {
    width: '45%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.ThemeColor,
    borderWidth: 1,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  textStyle: {
    color: Colors.ThemeColor
  }
})
const FirstContainer = styled.View`
  flex: 1;
`
