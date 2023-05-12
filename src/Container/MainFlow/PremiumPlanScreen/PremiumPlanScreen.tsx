import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import * as RNIap from 'react-native-iap'
import ReactNativeModal from 'react-native-modal'
import {TabView} from 'react-native-tab-view'
import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from '@gorhom/bottom-sheet'

import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import English from '../../../Resources/Locales/English'
import Colors from '../../../Theme/Colors'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {heightPx, moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import FreePlan from './Components/FreePlan'
import PlanTabBar, {SheetInnetText} from './Components/PlanTabBar'
import PlusPlan from './Components/PlusPlan'
import ProPlan from './Components/ProPlan'

const PremiumPlanScreen = () => {
  const layout = useWindowDimensions()
  const [isBottomSheet, setISBottomSheet] = useState(false)
  const snapPoints = useMemo(() => [heightPx(86)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    {key: English.R108, title: English.R108},
    {key: English.R110, title: English.R110},
    {key: English.R109, title: English.R109}
  ])

  const bottomSheetStyle = {
    borderWidth: 2,
    borderRadius: moderateScale(15),
    borderColor: Colors.greyCDCFD0,
    padding: scale(20)
  }

  const handleIndicatorStyle = {
    backgroundColor: Colors.greyShadeEBEB,
    width: scale(50)
  }

  const handleStyle = {
    bottom: verticalScale(10)
  }

  useEffect(() => {
    RNIap.initConnection().then((result) => {
      console.log('result', result)
    })
  }, [])

  const renderScene = useCallback(({route}: any) => {
    switch (route.key) {
      case English.R108:
        return <FreePlan />
      case English.R109:
        return <ProPlan onPress={() => setISBottomSheet(true)} />
      case English.R110:
        return <PlusPlan onPress={() => setISBottomSheet(true)} />
      default:
        return null
    }
  }, [])

  const renderTabView = useMemo(() => {
    return (
      <TabView
        renderTabBar={(props) => <PlanTabBar {...props} />}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    )
  }, [layout.width, renderScene, setIndex, index, routes])

  return (
    <AppContainer>
      <AppHeader isBack title={English.R107} />
      {renderTabView}
      {isBottomSheet && (
        <ReactNativeModal
          statusBarTranslucent
          onBackButtonPress={() => setISBottomSheet(false)}
          onBackdropPress={() => setISBottomSheet(false)}
          style={CommonStyles.modalStyle}
          backdropOpacity={0}
          isVisible
        >
          <GestureHandlerRootView style={CommonStyles.flex}>
            <BottomSheet
              enablePanDownToClose
              onClose={() => setISBottomSheet(false)}
              ref={bottomSheetRef}
              handleIndicatorStyle={handleIndicatorStyle}
              handleHeight={verticalScale(10)}
              handleStyle={handleStyle}
              snapPoints={snapPoints}
              style={bottomSheetStyle}
              backdropComponent={(props) => (
                <BottomSheetBackdrop
                  disappearsOnIndex={-1}
                  appearsOnIndex={0}
                  pressBehavior={'close'}
                  {...props}
                />
              )}
            >
              <BottomSheetScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <SheetInnetText>
                  {
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                  }
                </SheetInnetText>
                <SheetInnetText>
                  {
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                  }
                </SheetInnetText>
                <SheetInnetText>
                  {
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                  }
                </SheetInnetText>
              </BottomSheetScrollView>
            </BottomSheet>
          </GestureHandlerRootView>
        </ReactNativeModal>
      )}
    </AppContainer>
  )
}

export default PremiumPlanScreen
export interface PlanTabProps {
  onPress?: () => void
}
