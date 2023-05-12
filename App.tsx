import React, {useEffect} from 'react'
import {LogBox, Platform, TouchableOpacity} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {withIAPContext} from 'react-native-iap'
import * as RNIap from 'react-native-iap'
import {Provider} from 'react-redux'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {PersistGate} from 'redux-persist/integration/react'

import AppLoader from './src/Components/AppLoader'
import Loader from './src/Components/Loader'
import {persistor, store} from './src/Redux/Store'
import AppNavigation from './src/Router/AppNavigation'
import {CommonStyles} from './src/Theme/CommonStyles'

LogBox.ignoreAllLogs()

TouchableOpacity.defaultProps = {
  ...TouchableOpacity.defaultProps,
  activeOpacity: 0.5,
  hitSlop: 20
}

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId: '1015544764254-ajqoel7q2jb2qfvi5rqq0p6u7t2dnsmu.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId: '1015544764254-utpbchgs7m4vhdi1sdtkp0lqubbqpt0n.apps.googleusercontent.com'
    })

    RNIap.initConnection().then(() => {
      RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        .catch(() => {
          // exception can happen here if:
          // - there are pending purchases that are still pending (we can't consume a pending purchase)
          // in any case, you might not want to do anything special with the error
        })
        .then(() => {
          RNIap.purchaseUpdatedListener(async (purchase) => {
            console.log('Purchase-=-=->', JSON.stringify(purchase))
            // showAlertWithOkBtn(purchase.purchaseToken);

            // var receipt = '';
            const param: any = {}
            if (Platform.OS === 'ios') {
              param.receipt = purchase.transactionReceipt
              param.purchase_type = 'ios'
            } else {
              console.log('amdroid param')
              param.receipt = JSON.stringify(purchase)
              param.purchase_type = 'android'
              console.log('amdroid param 1')
            }
            // showAlertWithOkBtn('receipt ==>' + receipt);
            console.log('inAppPurchaseCall param =>' + JSON.stringify(param))
            if (purchase.transactionReceipt) {
              // console.log('receipt => ' + receipt);
            }
          })
          RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
            console.log('purchaseErrorListener', error)
          })
        })
    })
  }, [])
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={CommonStyles.flex}>
          <AppNavigation />
          <AppLoader ref={(ref: any) => Loader.setLoader(ref)} />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  )
}

export default withIAPContext(App)
