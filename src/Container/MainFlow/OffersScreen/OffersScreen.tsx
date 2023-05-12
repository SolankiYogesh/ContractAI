import React, {useCallback, useEffect, useState} from 'react'
import {FlatList, StyleSheet} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import English from '../../../Resources/Locales/English'
import {Screens} from '../../../Theme'
import {verticalScale} from '../../../Theme/Responsive'
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
  const [offers, setOffers] = useState([])

  useEffect(() => {
    setISLoading(true)
    APICall('get', {}, EndPoints.getOffers)
      .then((resp: any) => {
        setISLoading(false)

        if (resp?.status === 200 && resp?.data?.contracts) {
          setOffers(resp?.data?.contracts)
        }
      })
      .catch(() => {
        setISLoading(false)
      })
  }, [])

  const onPressOffer = useCallback(
    (contactItem: any) => {
      navigation.navigate(Screens.OfferDetailsScreen, {
        contactItem,
        isOfferScreen: true
      })
    },
    [navigation]
  )

  const onPressItem = useCallback(
    (index: number) => {
      setSelectedIndex(index)
    },
    [setSelectedIndex]
  )

  return (
    <AppContainer>
      <AppHeader isBack title={English.R154} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={isLoading ? data : offers}
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
      <AppButton
        disabled={isLoading}
        style={styles.input}
        onPress={() => onPressOffer(offers[selectedIndex])}
        title={English.R166}
      />
    </AppContainer>
  )
}

export default OffersScreen
const styles = StyleSheet.create({
  input: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: verticalScale(20)
  }
})
