import React from 'react'
import {FlatList} from 'react-native'

import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import English from '../../Resources/Locales/English'
import OfferItem from './Components/OfferItem'

const data = [
  {
    buyer: 'John Smith',
    seller: 'Seller Name :',
    contractId: 'O1001',
    created_at: '12 Feb 2023',
    title: 'Modern UI Project'
  },
  {
    buyer: 'John Smith',
    seller: 'Seller Name :',
    contractId: '10235',
    created_at: '12 Feb 2023',
    title: 'Logo UI'
  },
  {
    buyer: 'John Smith',
    seller: 'Seller Name :',
    contractId: '1022568',
    created_at: '12 Feb 2023',
    title: 'Modern UI Project'
  }
]

const OffersScreen = () => {
  return (
    <AppContainer>
      <AppHeader isBack title={English.R154} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item?.contractId}
        renderItem={({item}) => <OfferItem item={item} />}
      />
    </AppContainer>
  )
}

export default OffersScreen
