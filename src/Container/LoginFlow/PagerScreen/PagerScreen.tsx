import React, {useCallback, useRef, useState} from 'react'
import {Animated, FlatList, StyleSheet, View} from 'react-native'
import {ExpandingDot} from 'react-native-animated-pagination-dots'
import {useNavigation} from '@react-navigation/native'

import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppLogo from '../../../Components/AppLogo'
import TouchText from '../../../Components/TouchText'
import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {heightPx, moderateScale, scale, verticalScale, widthPx} from '../../../Theme/Responsive'
import PageItem from './Components/PageItem'

const pageData = [
  {
    id: 0,
    image: Images.pager1,
    buttonText: English.R1,
    title: English.R2,
    text: English.R3
  },
  {
    id: 1,
    image: Images.pager2,
    buttonText: English.R4,
    title: English.R5,
    text: English.R6
  },
  {
    id: 3,
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
    navigation.replace(Screens.LoginScreen)
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
      <View style={CommonStyles.rowView}>
        <AppLogo />
        {activeIndex <= 1 && (
          <TouchText
            style={styles.parentView}
            fontSize={moderateScale(16)}
            text={English.R65}
            onPress={onChangeLogin}
          />
        )}
      </View>

      <View style={styles.innnerView}>
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
      <AppButton
        onPress={onPressButton}
        style={styles.width}
        title={pageData[activeIndex].buttonText}
      />
    </AppContainer>
  )
}

export default PagerScreen

export const styles = StyleSheet.create({
  dotStyle: {
    width: verticalScale(10),
    height: verticalScale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(5)
  },
  dotContainerStyle: {
    position: 'relative',
    marginVertical: 0
  },
  parentView: {
    right: scale(20),
    position: 'absolute'
  },
  width: {
    marginBottom: verticalScale(60)
  },
  innnerView: {
    minHeight: heightPx(65),
    flex: 1
  }
})
