import React from 'react'
import {useRoute} from '@react-navigation/native'

import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import English from '../../Resources/Locales/English'
import TemplateItem from './Components/TemplateItem'

const EmailTemplateScreen = () => {
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer
  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R161} />
      <TemplateItem title={English.R159} />
      <TemplateItem title={English.R160} />
    </AppContainer>
  )
}

export default EmailTemplateScreen
