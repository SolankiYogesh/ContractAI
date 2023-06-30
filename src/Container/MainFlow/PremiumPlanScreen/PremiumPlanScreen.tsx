import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native'
import * as RNIap from 'react-native-iap'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'
import {TabView} from 'react-native-tab-view'
import {useSelector} from 'react-redux'
import {useRoute} from '@react-navigation/native'
import _ from 'lodash'

import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import Loader from '../../../Components/Loader'
import TNCSheet from '../../../Components/TNCSheet'
import English from '../../../Resources/Locales/English'
import {Constant} from '../../../Theme'
import Colors from '../../../Theme/Colors'
import {Fonts} from '../../../Theme/Fonts'
import {heightPx, moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import FreePlan from './Components/FreePlan'
import PlanTabBar from './Components/PlanTabBar'
import PlusPlan from './Components/PlusPlan'
import ProPlan from './Components/ProPlan'

const PremiumPlanScreen = () => {
  const route: any = useRoute().params
  const initialIndex = route?.initialIndex
  const isDrawer = route?.isDrawer
  const layout = useWindowDimensions()
  const [isBottomSheet, setISBottomSheet] = useState(false)
  const [productsBySku, setProductsBySku] = useState<any>([])
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
  const [index, setIndex] = useState(1)

  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)

  useEffect(() => {
    setIndex(initialIndex || 1)
  }, [initialIndex])

  const [routes] = useState([
    {key: English.R108, title: English.R108},
    {key: English.R110, title: English.R110},
    {key: English.R109, title: English.R109}
  ])

  const currentPlanIndex = useMemo(
    () => _.findIndex(routes, (i) => i.title === plan_details?.plan_name),
    [plan_details?.plan_name, routes]
  )
  const isVisible = useMemo(() => index === currentPlanIndex, [currentPlanIndex, index])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Loader.isLoading(true)
      RNIap.initConnection()
        .then((resp) => {
          Loader.isLoading(false)

          if (resp) {
            RNIap.getProducts(Constant.productSkus).then((resp) => {
              setProductsBySku(resp)
            })
          }
        })
        .catch(() => {
          Loader.isLoading(false)
        })
    }
  }, [])

  const onPurchase = useCallback(
    (id: number) => {
      if (productsBySku.length > 0 && Platform.OS === 'ios') {
        Loader.isLoading(true)
        RNIap.requestPurchase({
          sku: productsBySku[id].productId
        })
          .then(() => {
            Loader.isLoading(false)
          })
          .catch(() => {
            Loader.isLoading(false)
          })
      } else {
        Utility.showAlert('No subscription available.')
      }
    },
    [productsBySku]
  )

  const onRestorePurchase = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const purchaseHistories = await RNIap.getPurchaseHistory()

      if (purchaseHistories && purchaseHistories.length > 0) {
        // Restore the purchase.
        Utility.showAlert('Successfully restored your subscription.')
      } else {
        Utility.showAlert('No subscription available to restore.')
      }
    } else {
      Utility.showAlert('No subscription available to restore.')
    }
  }, [])

  const renderScene = useCallback(
    ({route}: any) => {
      switch (route.key) {
        case English.R108:
          return <FreePlan isCurrentPlan={plan_details?.plan_name === Constant.Plans.Free} />
        case English.R109:
          return (
            <ProPlan
              isCurrentPlan={plan_details?.plan_name === Constant.Plans.Pro}
              onPress={() => onPurchase(0)}
            />
          )
        case English.R110:
          return (
            <PlusPlan
              onPress={() => onPurchase(1)}
              isCurrentPlan={plan_details?.plan_name === Constant.Plans.Plus}
            />
          )
        default:
          return null
      }
    },
    [onPurchase, plan_details?.plan_name]
  )

  const renderTabView = useMemo(() => {
    return (
      <View style={styles.tabViewContainer}>
        <TabView
          renderTabBar={(props) => <PlanTabBar {...props} />}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          sceneContainerStyle={styles.sceneContainerStyle}
          initialLayout={{width: layout.width}}
        />
      </View>
    )
  }, [layout.width, renderScene, setIndex, index, routes])

  const renderRestoreButton = useMemo(() => {
    return (
      isVisible &&
      plan_details?.plan_name !== Constant.Plans.Free && (
        <AnimatedTouchableOpacity
          exiting={FadeOut}
          entering={FadeIn}
          hitSlop={{
            top: 20,
            bottom: 20
          }}
          onPress={onRestorePurchase}
          style={styles.restoreBtn}
        >
          <Text style={styles.restoreText}>{English.R190}</Text>
        </AnimatedTouchableOpacity>
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, onRestorePurchase, plan_details])

  const renderSheet = useMemo(() => {
    return isBottomSheet && <TNCSheet onClose={() => setISBottomSheet(false)} />
  }, [isBottomSheet])

  const renderBottomText = useMemo(() => {
    return (
      <View style={styles.bottomView}>
        <Text style={styles.descText}>{English.R189}</Text>

        {renderRestoreButton}
        <TouchableOpacity
          style={styles.termContianer}
          activeOpacity={0.8}
          onPress={() => setISBottomSheet(true)}
        >
          <Text style={styles.termText}>{English.R120}</Text>
        </TouchableOpacity>
      </View>
    )
  }, [renderRestoreButton])

  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R124} />
      {renderTabView}
      {renderBottomText}
      {renderSheet}
    </AppContainer>
  )
}

export default PremiumPlanScreen
export interface PlanTabProps {
  onPress?: () => void
  isCurrentPlan?: boolean
  isRestore?: boolean
}

export const styles = StyleSheet.create({
  termText: {
    color: Colors.greyShade9C9D,
    fontSize: moderateScale(12),
    fontFamily: Fonts.ThemeMedium
  },
  termContianer: {
    alignSelf: 'center',
    marginVertical: verticalScale(15),
    position: 'absolute',
    bottom: verticalScale(10)
  },

  descText: {
    color: Colors.greyShade9C9D,
    fontSize: moderateScale(11),
    fontFamily: Fonts.ThemeMedium,
    textAlign: 'center',
    marginHorizontal: scale(50),
    marginTop: verticalScale(10)
  },
  restoreText: {
    textAlign: 'center',
    color: Colors.blackShareRGB,
    fontSize: moderateScale(17),
    fontFamily: Fonts.ThemeSemiBold
  },
  restoreBtn: {
    marginTop: 'auto',
    marginBottom: verticalScale(70)
  },
  bottomView: {
    flex: 1
  },
  tabViewContainer: {
    height: heightPx(73)
  },
  sceneContainerStyle: {
    marginTop: verticalScale(20)
  }
})
