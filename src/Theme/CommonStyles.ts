import {StyleSheet} from 'react-native'
import styled from 'styled-components/native'

import {moderateScale, scale, verticalScale, W_HEIGHT, W_WIDTH, widthPx} from '../Theme/Responsive'
import Colors from './Colors'
import {Fonts} from './Fonts'

export const CommonStyles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.white
  },
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex: {
    flex: 1
  },
  rowView: {flexDirection: 'row', alignItems: 'center'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  onlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(5)
  },
  bodyStyle: {
    backgroundColor: Colors.white
  },
  fullView: {
    height: W_HEIGHT,
    width: W_WIDTH
  },
  viewFull: {
    height: '100%',
    width: '100%'
  },
  modalStyle: {
    padding: 0,
    margin: 0
  }
})

export const GettingText = styled.Text`
  font-family: ${Fonts.ThemeBold};
  font-size: ${(props: any) => props?.fontsize || moderateScale(20)}px;
  color: ${(props: any) => props?.color || Colors.blackShade2A30};
  margin-bottom: ${(props: any) => props?.marginBottom || 15}px;
  text-align: ${(props: any) => (props.isCenter ? 'center' : 'left')};
  margin-top: ${(props: any) => (props?.isTopMargin ? props?.top || 80 : 0)}px;
  margin-left: ${(props: any) => props?.marginHorizontal || 0}px;
  margin-right: ${(props: any) => props?.marginRight || props?.marginHorizontal || 0}px;
`
export const CreateAnAccountText = styled.Text`
  font-family: ${Fonts.ThemeRegular};
  font-size: ${(props: any) => props?.fontsize || moderateScale(14)}px;
  color: ${Colors.greyShade9797};
  text-align: ${(props: any) => (props.isCenter ? 'center' : 'left')};
  margin-bottom: ${(props: any) =>
    props?.marginBottom ? verticalScale(props?.marginBottom) : verticalScale(10)}px;
  margin-top: ${(props: any) => (props.isCenter ? verticalScale(25) : 0)}px;
  margin-bottom: ${(props: any) => (props.isCenter ? verticalScale(25) : verticalScale(5))}px;
  margin-left: ${(props: any) => props?.marginHorizontal || 0}px;
  margin-right: ${(props: any) => props?.marginHorizontal || 0}px;
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
  margin-top: ${(props: any) => props?.marginTop || 0}px;
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
  },
  marginBottom: {
    marginBottom: verticalScale(80),
    width: '90%',
    alignSelf: 'center'
  }
})
