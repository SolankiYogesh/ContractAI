import React, {useCallback} from 'react'
import {ImageSourcePropType, Keyboard, StyleProp, TextStyle, ViewStyle} from 'react-native'
import {DrawerActions, useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import {Colors, Images} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, verticalScale} from '../Theme/Responsive'
import BackButton from './BackButton'

interface AppHeaderProps {
  title?: string
  leftImage?: ImageSourcePropType
  rightImage?: ImageSourcePropType
  onPressRight?: () => void
  onPressLeft?: () => void
  isMenu?: boolean
  isBack?: boolean
  style?: StyleProp<ViewStyle>
  colors?: string[]
  headerTextStyle?: StyleProp<TextStyle>
}

const AppHeader = (props: AppHeaderProps) => {
  const {
    title = '',
    leftImage = Images.left_arrow,
    isMenu = false,
    rightImage,
    onPressLeft,
    onPressRight,
    isBack = false,
    style = {},
    colors = undefined,
    headerTextStyle = {}
  } = props
  const navigation = useNavigation()

  const onPressLeftRef = useCallback(() => {
    if (isMenu) {
      Keyboard.dismiss()
      navigation.dispatch(DrawerActions.toggleDrawer())
    } else if (isBack) {
      navigation.goBack()
    } else if (onPressLeft) {
      onPressLeft()
    }
  }, [isMenu, isBack, onPressLeft, navigation])

  return (
    <HeaderView style={style}>
      <BackButton
        isHeader
        colors={colors}
        image={isMenu ? Images.menu : isBack ? Images.left_arrow : leftImage}
        onPress={onPressLeftRef}
      />
      <TitleText style={headerTextStyle}>{title}</TitleText>
      {rightImage && <BackButton isHeader image={rightImage} onPress={onPressRight} />}
    </HeaderView>
  )
}
export default AppHeader
const HeaderView = styled.View`
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin-right: 20px;
  margin-left: 20px;
  height: 50px;
  justify-content: space-between;
  margin-top: ${verticalScale(10)}px;
`

const TitleText = styled.Text`
  font-size: ${moderateScale(18)}px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.black};
  flex: 1;
  text-align: center;
  position: absolute;
  width: 100%;
  z-index: -1;
`
