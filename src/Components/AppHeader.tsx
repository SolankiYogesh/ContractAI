import React, {useCallback} from 'react'
import {ImageSourcePropType, Keyboard, StyleProp, TextStyle, ViewStyle} from 'react-native'
import {DrawerActions, useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import {Colors, Images} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, verticalScale} from '../Theme/Responsive'
import BackButton from './BackButton'
import PremiumCount from './PremiumCount'

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
  isPremiumCount?: any
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
    headerTextStyle = {},
    isPremiumCount = null
  } = props
  const navigation = useNavigation()
  const isBig = title.split(' ').length > 2

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
      <TitleText isBig={isBig} style={headerTextStyle}>
        {title}
      </TitleText>
      {isPremiumCount && (
        <PremiumCount current={isPremiumCount?.current} total={isPremiumCount?.total} />
      )}
      {rightImage && <BackButton isHeader image={rightImage} onPress={onPressRight} />}
    </HeaderView>
  )
}
export default AppHeader
const HeaderView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  margin-left: 20px;
  height: 50px;
  justify-content: space-between;
  margin-top: ${verticalScale(10)}px;
`

const TitleText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.black};
  text-align: center;
  flex: 1;
  position: ${(props: any) => (props?.isBig ? 'relative' : 'absolute')};
  width: ${(props: any) => (props?.isBig ? 'auto' : '100%')};
  z-index: ${(props: any) => (props?.isBig ? 1 : -1)};
`
