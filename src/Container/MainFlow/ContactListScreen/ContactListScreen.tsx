/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {RefreshControl, StyleSheet} from 'react-native'
import {openSettings} from 'react-native-permissions'
import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated'
import {useIsFocused, useRoute} from '@react-navigation/native'
import _ from 'lodash'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AlertLoader from '../../../Components/AlertLoader'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import CustomSectionList from '../../../Components/CustomSectionList'
import LoadingView from '../../../Components/LoadingView'
import English from '../../../Resources/Locales/English'
import {Colors, Images} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import Permission from '../../../Theme/Permission'
import {moderateScale, scale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import ContactItem from './Components/ContactItem'
import ContactSelectListSheet from './Components/ContactSelectListSheet'

const ContactListScreen = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const allContactRef = useRef<any[]>([])
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer
  const isFromTemplate = route?.isFromTemplate
  const isFocus = useIsFocused()
  const [isRefreshing, setISRefreshing] = useState(false)

  const templateItem = route?.item
  const [isSheet, setISSheet] = useState(false)
  const offerItem = route?.offerItem
  const isFirst = useRef(false)

  const [isLoading, setISLoading] = useState(true)

  const [search, setSearch] = useState('')

  const getAllContactSync = useCallback(async (isLoader = true, isRefresh = false) => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    setISLoading(isLoader)
    setISRefreshing(isRefresh)
    APICall('get', {}, EndPoints.getContacts)
      .then((resp: any) => {
        setISLoading(false)
        setISRefreshing(false)
        if ((resp?.status === 200 || resp?.status === 400) && resp?.data?.data) {
          const formateData = _.map(resp?.data?.data || [], (i) => {
            return {
              ...i,
              value: i?.name
            }
          })
          const filterNumbers = _.filter(
            formateData,
            (i) => i?.number !== 'n/a' && i?.number !== 'null' && !!i?.number
          )

          setContacts(filterNumbers)
          allContactRef.current = filterNumbers
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        setISLoading(false)
      })
  }, [])

  useEffect(() => {
    if (isFocus) {
      getAllContactSync(!isFirst.current)
      isFirst.current = true
    }
  }, [isFocus])

  const renderSearchInput = useMemo(() => {
    return (
      <AppInput
        rightImage={Images.search}
        ContainerStyle={styles.ContainerStyle}
        value={search}
        isGradient
        returnKeyType={'done'}
        onChangeText={setSearch}
        placeholder={English.R70}
      />
    )
  }, [setSearch, search])

  const renderTitle = useCallback(({section: {title}}: any) => {
    return <TitleText>{title}</TitleText>
  }, [])

  const renderItem = useCallback(
    ({item, index}: any) => {
      return (
        <Animated.View key={item?.id} entering={FadeInUp.delay(index * 10)} exiting={FadeOutDown}>
          <ContactItem
            isFromTemplate={isFromTemplate}
            offerItem={isFromTemplate ? templateItem : offerItem}
            key={item?.id}
            isLoading={isLoading}
            item={item}
          />
        </Animated.View>
      )
    },
    [templateItem, isFromTemplate, isLoading]
  )

  const renderList = useMemo(() => {
    const DATA = _(contacts)
      .orderBy(['value'], ['asc'])
      .groupBy((item) => {
        const firstChar = item?.value?.charAt(0)?.toUpperCase()
        return /[A-Z]/.test(firstChar) ? firstChar : '#'
      })
      .map((value, key) => ({title: key, data: value}))
      .sortBy([(group) => (group.title === '#' ? 1 : 0)])
      .value()

    return (
      <CustomSectionList
        sections={DATA}
        searchAttribute={'value'}
        searchTerm={search}
        refreshControl={
          <RefreshControl
            onRefresh={() => getAllContactSync(false, true)}
            refreshing={isRefreshing}
          />
        }
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        renderSectionHeader={renderTitle}
      />
    )
  }, [contacts, renderItem, search, renderTitle, isLoading, getAllContactSync])

  const onPressSync = useCallback(async () => {
    const isContact = await Permission.getContactPermission()
    if (isContact) {
      setISSheet(true)
    } else {
      AlertLoader.show(English.R205, [
        {
          title: English.R207,
          style: 'cancel'
        },
        {title: English.R206, onPress: openSettings}
      ])
    }
  }, [])

  return (
    <AppContainer style={CommonStyles.flex}>
      <AppScrollView scrollEnabled={false} contentContainerStyle={CommonStyles.flex}>
        <AppHeader
          isMenu={isDrawer}
          isBack={!isDrawer}
          title={English.R102}
          rightImage={Images.sync}
          onPressRight={onPressSync}
        />
        {renderSearchInput}
        {!isLoading ? renderList : <LoadingView />}
        {isSheet && (
          <ContactSelectListSheet
            usersData={contacts}
            onClose={() => {
              setISSheet(false)
              getAllContactSync(false, false)
            }}
          />
        )}
      </AppScrollView>
    </AppContainer>
  )
}

export default ContactListScreen

export const TitleText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.black};
  margin-left: ${scale(20)}px;
  background-color: ${Colors.white};
`
const styles = StyleSheet.create({
  ContainerStyle: {
    alignSelf: 'center',
    width: '90%'
  }
})
