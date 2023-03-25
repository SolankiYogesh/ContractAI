import React, {useEffect, useMemo, useRef, useState} from 'react'
import {SectionList, StyleSheet} from 'react-native'
import Contacts from 'react-native-contacts'
import {useRoute} from '@react-navigation/native'
import _ from 'lodash'
import styled from 'styled-components/native'

import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppInput from '../../Components/AppInput'
import English from '../../Resources/Locales/English'
import {Colors, Images} from '../../Theme'
import {Fonts} from '../../Theme/Fonts'
import Permission from '../../Theme/Permission'
import {moderateScale} from '../../Theme/Responsive'
import Utility from '../../Theme/Utility'
import ContactItem from './Components/ContactItem'

const ContactListScreen = () => {
  const [contacts, setContacts] = useState<any[]>([])
  const allContactRef = useRef<any[]>([])
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer

  const [search, setSearch] = useState('')
  useEffect(() => {
    getAllContacts()
  }, [])

  useEffect(() => {
    if (!Utility.isEmpty(search)) {
      setContacts(allContactRef.current)
    } else {
      const filter = _.filter(contacts, (i: any) => {
        return i?.value?.toLowerCase().indexOf(search?.toLowerCase()) > -1
      })
      setContacts(filter)
    }
  }, [search])

  const getAllContacts = async () => {
    const isContact = await Permission.getContactPermission()
    if (isContact) {
      Contacts.getAll().then((resp) => {
        const filterEampty = _.filter(resp, (i) => i?.phoneNumbers?.length > 0)
        const filterData = _.map(filterEampty, (i: any, index) => {
          return {
            phoneNumbers: i?.phoneNumbers,
            value: i?.displayName || i?.givenName,
            profileImage: i?.thumbnailPath,
            key: index + Math.floor(Math.random() * 1000),
            emailAddresses: i?.emailAddresses
          }
        })
        allContactRef.current = filterData
        setContacts(filterData)
      })
    }
  }

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

  const renderList = useMemo(() => {
    const DATA = _(contacts)
      .orderBy(['value'], ['asc'])
      .groupBy((item) => item?.value?.charAt(0)?.toUpperCase())
      .map((value, key) => ({title: key, data: value}))
      .value()
    return (
      <SectionList
        sections={DATA}
        stickySectionHeadersEnabled
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <ContactItem item={item} />}
        renderSectionHeader={({section: {title}}) => <TitleText>{title}</TitleText>}
      />
    )
  }, [contacts])

  return (
    <AppContainer>
      <AppHeader
        isMenu={isDrawer}
        isBack={!isDrawer}
        title={English.R69}
        rightImage={Images.sync}
      />
      {renderSearchInput}
      {renderList}
    </AppContainer>
  )
}

export default ContactListScreen

export const TitleText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.black};
  margin-left: 15px;
  background-color: ${Colors.white};
`
const styles = StyleSheet.create({
  ContainerStyle: {
    width: '90%',
    alignSelf: 'center'
  }
})
