import styled from 'styled-components/native'

import {Colors} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, verticalScale} from '../../../../Theme/Responsive'

export const OTPInputContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(20)}px;
`

export const TextInputHidden = styled.TextInput`
  position: absolute;
  opacity: 0;
`

export const SplitOTPBoxesContainer = styled.Pressable`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`
export const SplitBoxes = styled.View`
  border-color: ${(props: any) => (props.isFilled ? Colors.ThemeColor : Colors.greyShadeE8)};
  border-width: 2px;
  border-radius: 10px;
  background-color: ${(props: any) => (props.isFilled ? Colors.white : Colors.greyShadeF7F)};
  width: ${verticalScale(60)}px;
  height: ${verticalScale(60)}px;
  align-items: center;
  justify-content: center;
`

export const SplitBoxText = styled.Text`
  text-align: center;
  color: ${Colors.black};
  font-family: ${Fonts.ThemeBold};
  font-size: ${moderateScale(20)}px;
`
