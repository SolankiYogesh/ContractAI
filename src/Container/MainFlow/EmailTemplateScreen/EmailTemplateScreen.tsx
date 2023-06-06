import React, {useCallback, useEffect, useState} from 'react'
import {FlatList} from 'react-native'
import {useRoute} from '@react-navigation/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import EmptyComponent from '../../../Components/EmptyComponent'
import LoadingView from '../../../Components/LoadingView'
import English from '../../../Resources/Locales/English'
import {CommonStyles} from '../../../Theme/CommonStyles'
import Utility from '../../../Theme/Utility'
import TemplateItem from './Components/TemplateItem'

const EmailTemplateScreen = () => {
  const route: any = useRoute().params
  const contactItem = route?.contactItem
  const isDrawer = route?.isDrawer
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  const getEmailTemplates = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
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

  useEffect(() => {
    getEmailTemplates()
  }, [getEmailTemplates])

  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R101} />
      {loading ? (
        <LoadingView />
      ) : templates?.length > 0 ? (
        <FlatList
          renderItem={({item}) => (
            <TemplateItem contactItem={contactItem} item={item} title={English.R160} />
          )}
          ListEmptyComponent={() => <EmptyComponent />}
          contentContainerStyle={templates?.length === 0 && CommonStyles.flex}
          data={templates}
          keyExtractor={(item: any) => item?.email_type}
        />
      ) : (
        <EmptyComponent />
      )}
    </AppContainer>
  )
}

export default EmailTemplateScreen
