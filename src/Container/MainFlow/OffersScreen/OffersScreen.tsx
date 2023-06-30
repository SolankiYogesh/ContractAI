import React, {useCallback, useEffect, useRef, useState} from 'react'
import {FlatList, StyleSheet} from 'react-native'
import {useSelector} from 'react-redux'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import _ from 'lodash'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import EmptyComponent from '../../../Components/EmptyComponent'
import English from '../../../Resources/Locales/English'
import {Colors, Constant, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import OfferItem from './Components/OfferItem'

const data = [
  {
    buyer: 'John Smith',
    seller: 'Smith John',
    id: 'O1001',
    created: '12 Feb 2023',
    address: 'Modern UI Project'
  },
  {
    buyer: 'John Smith',
    seller: 'Smith John',
    id: '10235',
    created: '12 Feb 2023',
    address: 'Logo UI'
  },
  {
    buyer: 'John Smith',
    seller: 'Smith John',
    id: '1022568',
    created: '12 Feb 2023',
    address: 'Modern UI Project'
  }
]

const OffersScreen = () => {
  const navigation: any = useNavigation()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setISLoading] = useState(true)
  const [offers, setOffers] = useState<any[]>([])
  const route: any = useRoute()?.params
  const isFocus = useIsFocused()
  const isFirst = useRef(true)
  const user = useSelector((state: any) => state?.user?.userData)
  const contactDetails = route?.data
  const isDrawer = route?.isDrawer

  const getOffer = useCallback(async (isLoader = true) => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    isFirst.current = false
    setISLoading(isLoader)
    APICall('get', {}, EndPoints.getOffers)
      .then((resp: any) => {
        setISLoading(false)

        if (resp?.status === 200 && resp?.data?.contracts) {
          const sortingData: any[] = _.orderBy(resp?.data?.contracts, (t) => t?.created, 'desc')
          setOffers(sortingData)
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        setISLoading(false)
      })
  }, [])

  useEffect(() => {
    getOffer()
  }, [getOffer])

  useEffect(() => {
    if (isFocus && !isFirst.current) {
      getOffer(false)
    }
  }, [isFocus, getOffer])

  const onPressOffer = useCallback(
    (contactItem: any) => {
      if (!contactDetails?.email) {
        navigation.push(Screens.ContactListScreen, {
          offerItem: contactItem
        })
        return
      }
      navigation.navigate(Screens.OfferDetailsScreen, {
        contactItem: {...(contactItem || {}), email: contactDetails?.email},
        isOfferScreen: true
      })
    },
    [contactDetails, navigation]
  )

  const onPressItem = useCallback(
    (index: number) => {
      setSelectedIndex(index)
    },
    [setSelectedIndex]
  )

  return (
    <AppContainer>
      <AppHeader
        isMenu={isDrawer}
        isBack={!isDrawer}
        isPremiumCount={
          user?.plan_details &&
          user?.plan_details?.plan_name === Constant.Plans.Free && {
            current: user?.plan_details?.monthly_send_emails,
            total: user?.plan_details?.send_offer_limit
          }
        }
        title={isDrawer ? English.R103 : English.R154}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={isLoading ? data : offers}
        ListEmptyComponent={() => <EmptyComponent />}
        contentContainerStyle={offers.length === 0 && !isLoading && CommonStyles.flex}
        keyExtractor={(item: any) => item?.id}
        renderItem={({item, index}) => (
          <OfferItem
            isLoading={isLoading}
            onPress={onPressItem}
            selectedIndex={selectedIndex}
            index={index}
            item={item}
          />
        )}
      />
      {!(isLoading || offers?.length === 0) && (
        <AppButton
          style={styles.input}
          onPress={() => onPressOffer(offers[selectedIndex])}
          title={English.R166}
          leftImage={Images.contract}
          leftImageStyle={styles.leftImageStyle}
        />
      )}
    </AppContainer>
  )
}

export default OffersScreen
const styles = StyleSheet.create({
  input: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: verticalScale(20)
  },
  leftImageStyle: {
    tintColor: Colors.white
  }
})
