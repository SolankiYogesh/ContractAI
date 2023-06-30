import React, {useEffect, useRef} from 'react'
import {
  EmitterSubscription,
  LogBox,
  TouchableOpacity,
  type TouchableOpacityProps
} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {finishTransaction, withIAPContext} from 'react-native-iap'
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  type ProductPurchase,
  purchaseUpdatedListener,
  type SubscriptionPurchase
} from 'react-native-iap'
import systemSetting from 'react-native-system-setting'
import {Provider} from 'react-redux'
import crashlytics from '@react-native-firebase/crashlytics'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import _ from 'lodash'
import {PersistGate} from 'redux-persist/integration/react'

import APICall from './src/APIRequest/APICall'
import EndPoints from './src/APIRequest/EndPoints'
import AlertLoader from './src/Components/AlertLoader'
import AlertModal, {AlertModalRef} from './src/Components/AlertModal'
import AppLoader from './src/Components/AppLoader'
import AppToast from './src/Components/AppToast'
import Loader from './src/Components/Loader'
import Toast from './src/Components/Toast'
import {persistor, store} from './src/Redux/Store'
import AppNavigation from './src/Router/AppNavigation'
import {Constant} from './src/Theme'
import {CommonStyles} from './src/Theme/CommonStyles'
import {emitter} from './src/Theme/Constant'
import Utility from './src/Theme/Utility'

LogBox.ignoreAllLogs()

const defaultTouchableOpacityProps: TouchableOpacityProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.5,
  hitSlop: {top: 20, bottom: 20, left: 20, right: 20}
}

TouchableOpacity.defaultProps = defaultTouchableOpacityProps

const App = () => {
  const isCalled = useRef(false)

  useEffect(() => {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId: '1015544764254-ajqoel7q2jb2qfvi5rqq0p6u7t2dnsmu.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId: '1015544764254-utpbchgs7m4vhdi1sdtkp0lqubbqpt0n.apps.googleusercontent.com'
    })

    crashlytics().log('App mounted.')

    const volumeListener = systemSetting.addVolumeListener((volume) => {
      if ((volume.music && volume.music > 0) || (volume.system && volume.system > 0)) {
        try {
          if (Constant.isAndroid) {
            systemSetting.setVolume(0, {
              type: 'system'
            })
          }
        } catch (error) {}
      }
    })

    try {
      if (Constant.isAndroid) {
        systemSetting.setVolume(0, {
          type: 'system'
        })
        systemSetting.setVolume(1, {
          type: 'music'
        })
      }
    } catch (error) {}
    let purchaseUpdateSubscription: EmitterSubscription

    initConnection().then(async () => {
      // we make sure that "ghost" pending payment are removed
      // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
      if (Constant.isAndroid) {
        await flushFailedPurchasesCachedAsPendingAndroid()
      }
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: SubscriptionPurchase | ProductPurchase) => {
          console.log('purchase', purchase)

          if (purchase?.transactionReceipt) {
            try {
              await finishTransaction({
                purchase
              })
            } catch (error) {}
            if (isCalled.current) {
              return
            }

            const receipt = purchase?.transactionReceipt

            const product = _.find(Constant.productData, (i) => i.id === purchase.productId)
            if (receipt && product) {
              const payload = {
                amount: product.amount,
                token: receipt,
                plan_name: product.product
              }
              APICall('post', payload, EndPoints.SettlePayments)
                .then((resp: any) => {
                  if (resp?.status === 200 && resp?.data?.success) {
                    emitter.emit('onPurchase')
                  }
                })
                .catch((e) => {
                  isCalled.current = true
                  Utility.showAlert(String(e?.data?.message))
                })
            }
          }
        }
      )
    })

    return () => {
      if (volumeListener) {
        systemSetting.removeVolumeListener(volumeListener)
      }
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription?.remove()
      }
    }
  }, [])
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={CommonStyles.flex}>
          <AppNavigation />
          <AppLoader ref={(ref: any) => Loader.setLoader(ref)} />
          <AppToast ref={(ref: any) => Toast.setLoader(ref)} />
          <AlertModal ref={(ref: AlertModalRef) => AlertLoader.setLoader(ref)} />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  )
}

export default withIAPContext(App)
