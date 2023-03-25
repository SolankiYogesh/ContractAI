import {StyleSheet} from 'react-native'
import styled from 'styled-components/native'

import {Colors} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, scale, verticalScale, widthPx} from '../Theme/Responsive'

export const GettingText = styled.Text`
  font-family: ${Fonts.ThemeBold};
  font-size: ${(props: any) => props?.fontsize || moderateScale(20)}px;
  color: ${Colors.blackShade2A30};
  margin-bottom: ${(props: any) => props?.marginBottom || 15}px;
  text-align: ${(props: any) => (props.isCenter ? 'center' : 'left')};
  margin-top: ${(props: any) => (props?.isTopMargin ? props?.top || 80 : 0)}px;
  margin-left: ${(props: any) => props?.marginHorizontal || 0}px;
  margin-right: ${(props: any) => props?.marginHorizontal || 0}px;
`
export const CreateAnAccountText = styled.Text`
  font-family: ${Fonts.ThemeRegular};
  font-size: ${moderateScale(14)}px;
  color: ${Colors.greyShade9797};
  text-align: ${(props: any) => (props.isCenter ? 'center' : 'left')};
  margin-bottom: ${(props: any) => props?.marginBottom || 10}px;
  margin-top: ${(props: any) => (props.isCenter ? verticalScale(30) : 0)}px;
  margin-bottom: ${(props: any) => (props.isCenter ? verticalScale(30) : verticalScale(5))}px;
  margin-left: ${(props: any) => props?.marginHorizontal || 0}px;
  margin-right: ${(props: any) => props?.marginHorizontal || 0}px;
`

export const AlreadyAccountText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: ${moderateScale(14)}px;
  color: ${(props: any) => (!props.isClickable ? Colors.blackShade2A30 : Colors.ThemeColor)};
  margin-top: ${verticalScale(30)}px;
  margin-bottom: ${verticalScale(30)}px;
  text-align: center;
`

export const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  align-self: center;
`
export const ScrollContainer = styled.View`
  margin-left: ${scale(20)}px;
  margin-right: ${scale(20)}px;
  flex: 1;
  margin-top: ${(props: any) => props?.marginTop || 0};
`
export const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    width: '100%'
  },
  input2Style: {
    width: '45%'
  },
  googleContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyShadeE8,
    width: '45%'
  },
  googleFullContainer: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.greyShadeE8,
    width: '100%'
  },
  fbContainer: {
    backgroundColor: Colors.bluesShade3B82,
    width: '45%'
  },
  fbContainerFullContainer: {
    backgroundColor: Colors.bluesShade3B82,
    width: '100%'
  },
  textStyle: {
    color: Colors.blackShade2A30
  },
  width: {
    width: '100%',
    marginBottom: verticalScale(20)
  },
  fixedWidth: {
    width: widthPx(43)
  }
})
