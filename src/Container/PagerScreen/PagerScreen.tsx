import React, {useCallback, useRef, useState} from 'react'
import {Animated, FlatList, StyleSheet, View} from 'react-native'
import {ExpandingDot} from 'react-native-animated-pagination-dots'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import English from '../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../Theme'
import {Fonts} from '../../Theme/Fonts'
import {moderateScale, scale, verticalScale, widthPx} from '../../Theme/Responsive'
import PageItem from './Components/PageItem'

const pageData = [
  {
    image: Images.pager1,
    buttonText: English.R1,
    title: English.R2,
    text: English.R3
  },
  {
    image: Images.pager2,
    buttonText: English.R4,

    title: English.R5,
    text: English.R6
  },
  {
    image: Images.pager3,
    buttonText: English.R7,

    title: English.R9,
    text: English.R8
  }
]

const PagerScreen = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<FlatList>(null)
  const navigation: any = useNavigation()

  const onChangeLogin = useCallback(() => {
    navigation.navigate(Screens.LoginScreen)
  }, [navigation])

  const onPressButton = useCallback(() => {
    if (activeIndex < pageData.length - 1) {
      listRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true
      })
    } else {
      onChangeLogin()
    }
  }, [activeIndex, onChangeLogin])

  return (
    <AppContainer>
      <View>
        <View style={styles.parentView}>
          {activeIndex <= 1 && <SkipButton onPress={onChangeLogin}>{English.R65}</SkipButton>}
        </View>

        <FlatList
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          ref={listRef}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
            useNativeDriver: false,
            listener: (event: any) => {
              setActiveIndex(
                Number(Number(event?.nativeEvent?.contentOffset?.x / widthPx(100)).toFixed())
              )
            }
          })}
          decelerationRate={'normal'}
          scrollEventThrottle={16}
          data={pageData}
          renderItem={({item}) => <PageItem item={item} />}
        />
      </View>
      <ExpandingDot
        data={pageData}
        expandingDotWidth={30}
        scrollX={scrollX}
        inActiveDotColor={Colors.purpleShadCFC}
        activeDotColor={Colors.purpleShad8A}
        inActiveDotOpacity={0.6}
        dotStyle={styles.dotStyle}
        containerStyle={styles.dotContainerStyle}
      />
      <AppButton onPress={onPressButton} title={pageData[activeIndex].buttonText} />
    </AppContainer>
  )
}

export default PagerScreen
const SkipButton = styled.Text`
  font-family: ${Fonts.ThemeSemiBold};
  font-size: ${moderateScale(16)}px;
  color: ${Colors.ThemeColor};
  align-self: flex-end;
  margin-right: 20px;
`

export const styles = StyleSheet.create({
  dotStyle: {
    width: verticalScale(10),
    height: verticalScale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(5)
  },
  dotContainerStyle: {
    position: 'relative'
  },
  parentView: {
    height: verticalScale(18)
  }
})
