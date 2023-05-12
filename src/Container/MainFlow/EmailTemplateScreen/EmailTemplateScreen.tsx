import React, {useEffect, useState} from 'react'
import {FlatList} from 'react-native'
import {useRoute} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import LoadingView from '../../../Components/LoadingView'
import English from '../../../Resources/Locales/English'
import TemplateItem from './Components/TemplateItem'

const EmailTemplateScreen = () => {
  const route: any = useRoute().params
  const contactItem = route?.contactItem
  const isDrawer = route?.isDrawer
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    APICall('get', {}, EndPoints.getEmailTemplates)
      .then((resp: any) => {
        setLoading(false)

        if (resp?.status === 200 && resp?.data) {
          setTemplates(resp?.data?.data)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R161} />
      {!loading ? (
        <FlatList
          renderItem={({item}) => (
            <TemplateItem contactItem={contactItem} item={item} title={English.R160} />
          )}
          data={templates}
          keyExtractor={(item: any) => item?.email_type}
        />
      ) : (
        <LoadingView />
      )}
    </AppContainer>
  )
}

export default EmailTemplateScreen
