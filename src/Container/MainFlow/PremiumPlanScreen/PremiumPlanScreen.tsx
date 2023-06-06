/* eslint-disable react-native/no-unused-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions} from 'react-native'
import * as RNIap from 'react-native-iap'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'
import {TabView} from 'react-native-tab-view'
import WebView from 'react-native-webview'
import {useSelector} from 'react-redux'
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet'
import {useRoute} from '@react-navigation/native'
import {encode} from 'js-base64'

import EndPoints from '../../../APIRequest/EndPoints'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import Loader from '../../../Components/Loader'
import LoadingView from '../../../Components/LoadingView'
import English from '../../../Resources/Locales/English'
import {Constant} from '../../../Theme'
import Colors from '../../../Theme/Colors'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {heightPx, moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import FreePlan from './Components/FreePlan'
import PlanTabBar from './Components/PlanTabBar'
import PlusPlan from './Components/PlusPlan'
import ProPlan from './Components/ProPlan'

const PremiumPlanScreen = () => {
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer
  const layout = useWindowDimensions()
  const [isBottomSheet, setISBottomSheet] = useState(false)
  const snapPoints = useMemo(() => [heightPx(86)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [productsBySku, setProductsBySku] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
  const [index, setIndex] = useState(1)
  const isVisible = useMemo(() => index !== 0, [index])
  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)

  const [routes] = useState([
    {key: English.R108, title: English.R108},
    {key: English.R110, title: English.R110},
    {key: English.R109, title: English.R109}
  ])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNIap.initConnection().then((resp) => {
        if (resp) {
          RNIap.getProducts(Constant.productSkus).then((resp) => {
            setProductsBySku(resp)
          })
        }
      })
    }
  }, [])

  const onPurchase = useCallback(() => {
    if (productsBySku.length > 0 && Platform.OS === 'ios') {
      Loader.isLoading(true)
      RNIap.requestPurchase({
        sku: productsBySku[0].productId
      })
        .then((resp) => {
          Loader.isLoading(false)
          const objJsonB64 = encode(resp?.transactionReceipt)
        })
        .catch(() => {
          Loader.isLoading(false)
        })
    } else {
      Utility.showAlert('No subscription available.')
    }
  }, [productsBySku])

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
              onPress={onPurchase}
            />
          )
        case English.R110:
          return (
            <PlusPlan
              onPress={onPurchase}
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
      <TabView
        renderTabBar={(props) => <PlanTabBar {...props} />}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    )
  }, [layout.width, renderScene, setIndex, index, routes])

  const renderRestoreButton = useMemo(() => {
    return (
      isVisible && (
        <AnimatedTouchableOpacity
          exiting={FadeOut}
          entering={FadeIn}
          onPress={onRestorePurchase}
          style={styles.restoreBtn}
        >
          <Text style={styles.restoreText}>{English.R190}</Text>
        </AnimatedTouchableOpacity>
      )
    )
  }, [isVisible, onRestorePurchase])

  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R124} />
      {renderTabView}
      {isBottomSheet && (
        <BottomSheet
          enablePanDownToClose
          onClose={() => setISBottomSheet(false)}
          ref={bottomSheetRef}
          containerStyle={styles.containerStyle}
          handleIndicatorStyle={styles.handleIndicatorStyle}
          handleHeight={verticalScale(10)}
          handleStyle={styles.handleStyle}
          snapPoints={snapPoints}
          style={styles.bottomSheetStyle}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior={'close'}
              {...props}
            />
          )}
        >
          <WebView
            source={{
              uri: EndPoints.TNC
            }}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            scalesPageToFit
            scrollEnabled
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            overScrollMode={'never'}
            style={CommonStyles.flex}
          />
          {loading && <LoadingView style={StyleSheet.absoluteFill} />}
        </BottomSheet>
      )}
      <Text style={styles.descText}>{English.R189}</Text>

      {renderRestoreButton}
      <TouchableOpacity
        style={styles.termContianer}
        activeOpacity={0.8}
        onPress={() => setISBottomSheet(true)}
      >
        <Text style={styles.termText}>{English.R120}</Text>
      </TouchableOpacity>
    </AppContainer>
  )
}

export default PremiumPlanScreen
export interface PlanTabProps {
  onPress?: () => void
  isCurrentPlan?: boolean
}

export const styles = StyleSheet.create({
  bottomSheetStyle: {
    borderRadius: moderateScale(15),
    padding: scale(20)
  },
  handleStyle: {
    bottom: verticalScale(10)
  },
  handleIndicatorStyle: {
    backgroundColor: Colors.greyShadeEBEB,
    width: scale(50)
  },
  termText: {
    color: Colors.greyShade9C9D,
    fontSize: moderateScale(12),
    fontFamily: Fonts.ThemeMedium
  },
  termContianer: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center'
  },
  containerStyle: {
    zIndex: 1000
  },
  buttonStyle: {
    borderWidth: 2,
    borderColor: Colors.ThemeColor
  },

  textStyle: {
    color: Colors.ThemeColor
  },
  tabContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    height: heightPx(80),
    width: '100%'
  },
  descText: {
    color: Colors.greyShade9C9D,
    fontSize: moderateScale(11),
    fontFamily: Fonts.ThemeMedium,
    position: 'absolute',
    bottom: '18%',
    textAlign: 'center',
    marginHorizontal: scale(50)
  },
  restoreText: {
    textAlign: 'center',
    color: Colors.blackShareRGB,
    fontSize: moderateScale(17),
    fontFamily: Fonts.ThemeSemiBold
  },
  restoreBtn: {
    bottom: '8%'
  }
})
