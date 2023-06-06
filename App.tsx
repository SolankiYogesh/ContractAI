import React, {useCallback, useEffect} from 'react'
import {
  EmitterSubscription,
  LogBox,
  Platform,
  TouchableOpacity,
  type TouchableOpacityProps
} from 'react-native'
import {Dirs} from 'react-native-file-access'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {withIAPContext} from 'react-native-iap'
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  type ProductPurchase,
  type PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  type SubscriptionPurchase
} from 'react-native-iap'
import systemSetting from 'react-native-system-setting'
import TrackPlayer, {AppKilledPlaybackBehavior} from 'react-native-track-player'
import {Provider} from 'react-redux'
import {CacheManager} from '@georstat/react-native-image-cache'
import crashlytics from '@react-native-firebase/crashlytics'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {PersistGate} from 'redux-persist/integration/react'

import AppLoader from './src/Components/AppLoader'
import AppToast from './src/Components/AppToast'
import Loader from './src/Components/Loader'
import Toast from './src/Components/Toast'
import {persistor, store} from './src/Redux/Store'
import AppNavigation from './src/Router/AppNavigation'
import {CommonStyles} from './src/Theme/CommonStyles'

LogBox.ignoreAllLogs()

const defaultTouchableOpacityProps: TouchableOpacityProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.5,
  hitSlop: {top: 20, bottom: 20, left: 20, right: 20}
}

TouchableOpacity.defaultProps = defaultTouchableOpacityProps

const App = () => {
  const setupTrackPlayer = useCallback(() => {
    TrackPlayer.setupPlayer({}).then(() => {
      TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
        }
      }).then(() => {})
    })
  }, [])

  useEffect(() => {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId: '1015544764254-ajqoel7q2jb2qfvi5rqq0p6u7t2dnsmu.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId: '1015544764254-utpbchgs7m4vhdi1sdtkp0lqubbqpt0n.apps.googleusercontent.com'
    })
    setupTrackPlayer()
    crashlytics().log('App mounted.')
    CacheManager.config = {
      baseDir: `${Dirs.CacheDir}/images_cache/`,
      blurRadius: 15,
      cacheLimit: 0,
      sourceAnimationDuration: 1000,
      thumbnailAnimationDuration: 1000
    }

    const volumeListener = systemSetting.addVolumeListener((volume) => {
      if ((volume.music && volume.music > 0) || (volume.system && volume.system > 0)) {
        try {
          if (Platform.OS === 'android') {
            systemSetting.setVolume(0, {
              type: 'system'
            })
          }
        } catch (error) {}
      }
    })

    try {
      if (Platform.OS === 'android') {
        systemSetting.setVolume(0, {
          type: 'system'
        })
        systemSetting.setVolume(1, {
          type: 'music'
        })
      }
    } catch (error) {}
    let purchaseUpdateSubscription: EmitterSubscription
    let purchaseErrorSubscription: EmitterSubscription
    initConnection().then(async () => {
      // we make sure that "ghost" pending payment are removed
      // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid()
      }
      purchaseUpdateSubscription = purchaseUpdatedListener(
        (purchase: SubscriptionPurchase | ProductPurchase) => {
          if (purchase?.transactionReceipt) {
            const receipt = purchase?.transactionReceipt
            if (receipt) {
              // call api here
            }
          }
        }
      )

      purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
        console.log('purchaseErrorListener', error)
      })
    })

    return () => {
      if (volumeListener) {
        systemSetting.removeVolumeListener(volumeListener)
      }
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription?.remove()
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove()
      }
    }
  }, [setupTrackPlayer])
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={CommonStyles.flex}>
          <AppNavigation />
          <AppLoader ref={(ref: any) => Loader.setLoader(ref)} />
          <AppToast ref={(ref: any) => Toast.setLoader(ref)} />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  )
}

export default withIAPContext(App)
