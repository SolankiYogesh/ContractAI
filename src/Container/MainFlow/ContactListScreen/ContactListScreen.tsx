/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {SectionList, StyleSheet} from 'react-native'
import {useRoute} from '@react-navigation/native'
import Skeleton from '@thevsstech/react-native-skeleton'
import _ from 'lodash'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import EmptyComponent from '../../../Components/EmptyComponent'
import English from '../../../Resources/Locales/English'
import {Colors, Images} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale, widthPx} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import ShareItem from '../OffersScreen/OfferDetailsScreen/Components/ShareItem'
import ContactItem from './Components/ContactItem'
import ContactSelectListSheet from './Components/ContactSelectListSheet'

const ContactListScreen = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const allContactRef = useRef<any[]>([])
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer
  const isFromTemplate = route?.isFromTemplate
  const templateItem = route?.item
  const [isSheet, setISSheet] = useState(false)

  const [isLoading, setISLoading] = useState(true)

  const [search, setSearch] = useState('')

  const getAllContactSync = useCallback((isLoader = true) => {
    setISLoading(isLoader)
    APICall('get', {}, EndPoints.getContacts)
      .then((resp: any) => {
        setISLoading(false)
        if (resp?.status === 200 && resp?.data?.data?.length > 0) {
          const formateData = _.map(resp?.data?.data, (i, index) => {
            return {
              ...i,
              key: `${Math.random()}${i?.value}${index}`,
              value: i?.name
            }
          })
          setContacts(formateData)
          allContactRef.current = formateData
        }
      })
      .catch(() => {
        setISLoading(false)
      })
  }, [])

  useEffect(() => {
    getAllContactSync()
  }, [])

  useEffect(() => {
    if (!Utility.isEmpty(search)) {
      setContacts(allContactRef.current)
    } else {
      const filter = _.filter(allContactRef.current, (i: any) => {
        return i?.value?.toLowerCase().indexOf(search?.toLowerCase()) > -1
      })
      setContacts(filter)
    }
  }, [search])

  const onUserUpdate = useCallback(
    (users: any[]) => {
      let cloneData = Utility.deepClone(contacts)

      _.map(users, (i, index) => {
        if (i?.to_add) {
          cloneData.push({
            ...i,
            key: `${Math.random()}${i?.value}${index}`,
            value: i?.name
          })
        } else {
          cloneData = _.filter(cloneData, (item: any) => item?.number !== i?.number)
        }
      })

      setContacts(cloneData)
    },
    [contacts]
  )

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

  const renderTitle = useCallback(
    ({section: {title}}: any) => {
      return !isLoading || isFromTemplate ? (
        <TitleText>{title}</TitleText>
      ) : (
        <Skeleton>
          <Skeleton.Item
            marginLeft={scale(20)}
            width={widthPx(10)}
            height={verticalScale(25)}
            borderRadius={4}
          />
        </Skeleton>
      )
    },
    [isLoading, isFromTemplate]
  )

  const renderItem = useCallback(
    ({item}: any) => {
      return isFromTemplate ? (
        <ShareItem key={item?.id} offerItem={templateItem} item={item} />
      ) : (
        <ContactItem key={item?.id} isLoading={isLoading} item={item} />
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
      <SectionList
        sections={DATA}
        keyboardShouldPersistTaps={'always'}
        stickySectionHeadersEnabled
        ListEmptyComponent={() => <EmptyComponent />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.id}
        renderItem={renderItem}
        contentContainerStyle={DATA.length === 0 && CommonStyles.flex}
        renderSectionHeader={renderTitle}
      />
    )
  }, [contacts, renderItem, renderTitle])

  return (
    <AppContainer style={CommonStyles.flex}>
      <AppHeader
        isMenu={isDrawer}
        isBack={!isDrawer}
        title={English.R69}
        rightImage={!isFromTemplate && Images.sync}
        onPressRight={() => setISSheet(true)}
      />
      {renderSearchInput}
      {renderList}
      {isSheet && (
        <ContactSelectListSheet
          usersData={contacts}
          onUserUpdate={onUserUpdate}
          onClose={() => setISSheet(false)}
        />
      )}
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
