/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native'
import Contacts from 'react-native-contacts'
import {openSettings} from 'react-native-permissions'
import BottomSheet, {BottomSheetBackdrop, BottomSheetSectionList} from '@gorhom/bottom-sheet'
import _ from 'lodash'
import {v4 as uuid} from 'uuid'

import APICall from '../../../../APIRequest/APICall'
import EndPoints from '../../../../APIRequest/EndPoints'
import AppInput from '../../../../Components/AppInput'
import CustomSectionList from '../../../../Components/CustomSectionList'
import LoadingView from '../../../../Components/LoadingView'
import {ForgotPasswordText} from '../../../../Components/TouchText'
import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import Permission from '../../../../Theme/Permission'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'
import {TitleText} from '../ContactListScreen'
import ContactItem from './ContactItem'

interface ContactSelectListSheetProps {
  onClose?: () => void
  usersData?: any[]
}

const ContactSelectListSheet = (props: ContactSelectListSheetProps) => {
  const {onClose, usersData = []} = props
  const snapPoints = useMemo(() => ['100%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const usersRef = useRef<any[]>([])
  const mapAlreadyUsers = useMemo(() => _.map(usersData, (i) => i?.number), [usersData])
  const [isLoading, setISLoading] = useState(true)

  const getUserFromDevice = useCallback(() => {
    Contacts.getAllWithoutPhotos()
      .then((resp) => {
        setISLoading(false)
        const validNumber = _.map(resp, (i) => {
          return {
            id: uuid(),
            name: i?.displayName || `${i?.familyName} ${i?.givenName}`,
            number: _.uniqBy(i?.phoneNumbers, (n) => n?.number).filter(
              (n) => n?.number?.length > 9
            )[0]?.number,
            email: i?.emailAddresses?.length > 0 ? i?.emailAddresses[0].email : '',
            value: i?.displayName || `${i?.familyName} ${i?.givenName}`
          }
        })
        const filterEampty = _.filter(validNumber, (i: any) => i?.number)

        const withSelectedUsers = _.map(usersData, (i: any) => {
          return {...i, isSelected: true}
        })

        const withSelected = _.map(filterEampty, (i: any) => {
          return {...i, isSelected: _.includes(mapAlreadyUsers, i?.number)}
        })
        const mergedData = _.unionBy([...withSelected, ...withSelectedUsers], (i) => i?.number)

        setUsers(mergedData)
        usersRef.current = mergedData
      })
      .catch(() => setISLoading(false))
  }, [mapAlreadyUsers])

  const onPressItem = useCallback(
    (item: any) => {
      const clone = Utility.deepClone(users)
      const index = _.findIndex(clone, (i: any) => i?.number === item?.number)
      clone[index].isSelected = !clone[index].isSelected
      clone[index].isEdited = true
      usersRef.current = clone
      setUsers(clone)
    },
    [users, setUsers]
  )

  useEffect(() => {
    Permission.getContactPermission().then((resp) => {
      if (resp) {
        getUserFromDevice()
      } else {
        Alert.alert(
          'Reeva',
          'Please allow permission to access contacts',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {text: 'Change Permission', onPress: () => openSettings()}
          ],
          {userInterfaceStyle: 'light'}
        )
      }
    })
  }, [getUserFromDevice])

  const onPressSave = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    const payloadUsers = _.map(users, (i) => {
      return {
        name: i?.name,
        number: i?.number,
        email: i?.email,
        to_add:
          _.includes(mapAlreadyUsers, i?.number) && i?.isSelected
            ? true
            : !_.includes(mapAlreadyUsers, i?.number) && i?.isSelected,
        isEdited: !!i?.isEdited
      }
    })
    const filterData = _.filter(payloadUsers, (i) => i?.isEdited)
    const uniqContacts = _.uniqBy(filterData, (i) => i?.number)

    if (uniqContacts.length > 0) {
      APICall('post', uniqContacts, EndPoints.getContacts).then(() => {
        Alert.alert(
          'Reeva',
          English.R188,
          [{text: 'OK', onPress: () => bottomSheetRef.current?.close()}],
          {userInterfaceStyle: 'light'}
        )
      })
    } else {
      bottomSheetRef.current?.close()
    }
  }, [mapAlreadyUsers, users])

  const renderList = useMemo(() => {
    const DATA = _(users)
      .orderBy(['value'], ['asc'])
      .groupBy((item) => item?.value?.charAt(0)?.toUpperCase())
      .map((value, key) => ({title: key, data: value}))
      .value()

    return (
      <CustomSectionList
        Component={BottomSheetSectionList}
        sections={DATA}
        searchAttribute={'value'}
        searchTerm={search}
        bounces={false}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        keyExtractor={(item: any) => item?.id}
        renderItem={({item}) => (
          <ContactItem onPress={() => onPressItem(item)} isSelectList item={item} />
        )}
        renderSectionHeader={({section: {title}}) => <TitleText>{title}</TitleText>}
      />
    )
  }, [onPressItem, users, search])

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
  }, [search])

  return (
    <>
      <BottomSheet
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={styles.backgroundStyle}
        ref={bottomSheetRef}
        handleIndicatorStyle={styles.handleIndicatorStyle}
        handleHeight={verticalScale(10)}
        handleStyle={styles.handleStyle}
        snapPoints={snapPoints}
        style={styles.bottomSheetStyle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior={'close'}
            {...props}
          />
        )}
      >
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
            <ForgotPasswordText fontSize={moderateScale(16)}>{English.R183}</ForgotPasswordText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressSave}>
            <ForgotPasswordText fontSize={moderateScale(16)}>{English.R182}</ForgotPasswordText>
          </TouchableOpacity>
        </View>
        {renderSearchInput}

        {isLoading ? <LoadingView /> : renderList}
      </BottomSheet>
    </>
  )
}

export default ContactSelectListSheet
const styles = StyleSheet.create({
  ContainerStyle: {
    width: '90%',
    alignSelf: 'center'
  },
  headerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000
  },
  backgroundStyle: {
    borderRadius: 0
  },
  handleIndicatorStyle: {
    backgroundColor: Colors.greyShadeEBEB,
    width: scale(50)
  },
  handleStyle: {
    bottom: verticalScale(10)
  },
  bottomSheetStyle: {
    padding: scale(10)
  }
})
