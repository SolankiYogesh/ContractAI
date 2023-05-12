/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native'
import Contacts from 'react-native-contacts'
import BottomSheet, {BottomSheetBackdrop, BottomSheetSectionList} from '@gorhom/bottom-sheet'
import _ from 'lodash'
import {v4 as uuid} from 'uuid'

import APICall from '../../../../APIRequest/APICall'
import EndPoints from '../../../../APIRequest/EndPoints'
import AppInput from '../../../../Components/AppInput'
import EmptyComponent from '../../../../Components/EmptyComponent'
import {ForgotPasswordText} from '../../../../Components/TouchText'
import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import Permission from '../../../../Theme/Permission'
import {heightPx, moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'
import {TitleText} from '../ContactListScreen'
import ContactItem from './ContactItem'

interface ContactSelectListSheetProps {
  onClose?: () => void
  usersData?: any[]
  onUserUpdate?: (users: any[]) => void
}

const ContactSelectListSheet = (props: ContactSelectListSheetProps) => {
  const {onClose, usersData = [], onUserUpdate = () => {}} = props
  const snapPoints = useMemo(() => [heightPx(100)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const usersRef = useRef<any[]>([])
  const mapAlreadyUsers = useMemo(() => _.map(usersData, (i) => i?.number), [usersData])
  const [isLoading, setISLoading] = useState(false)

  const getUserFromDevice = useCallback(() => {
    Contacts.getAllWithoutPhotos().then((resp) => {
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
      const codeNumber = _.map(filterEampty, (i: any) => {
        return {...i, number: Utility.removeCode(i.number)}
      })
      const withSelected = _.map(filterEampty, (i: any) => {
        return {...i, isSelected: _.includes(mapAlreadyUsers, i?.number)}
      })

      setUsers(withSelected)
      usersRef.current = codeNumber
    })
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
      }
    })
  }, [getUserFromDevice])

  const onHandleSearch = useCallback(() => {
    if (!Utility.isEmpty(search)) {
      setUsers(usersRef.current)
    } else {
      const filter = _.filter(users, (i: any) => {
        return i?.value?.toLowerCase().indexOf(search?.toLowerCase()) > -1
      })
      setUsers(filter)
    }
  }, [search, users])

  useEffect(() => {
    onHandleSearch()
  }, [search])

  const onPressSave = useCallback(() => {
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
    if (filterData.length > 0) {
      setISLoading(true)
      APICall('post', filterData, EndPoints.getContacts).then(() => {
        setTimeout(() => {
          setISLoading(false)
          onUserUpdate(filterData)
          bottomSheetRef.current?.close()
        }, 1000)
      })
    } else {
      bottomSheetRef.current?.close()
      setISLoading(false)
    }
  }, [mapAlreadyUsers, onUserUpdate, users])

  const renderList = useMemo(() => {
    const DATA = _(users)
      .orderBy(['value'], ['asc'])
      .groupBy((item) => item?.value?.charAt(0)?.toUpperCase())
      .map((value, key) => ({title: key, data: value}))
      .value()

    return (
      <BottomSheetSectionList
        sections={DATA}
        contentContainerStyle={DATA.length === 0 && CommonStyles.flex}
        ListEmptyComponent={() => <EmptyComponent />}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        keyExtractor={(item: any) => item?.id}
        renderItem={({item}) => (
          <ContactItem onPress={() => onPressItem(item)} isSelectList item={item} />
        )}
        renderSectionHeader={({section: {title}}) => <TitleText>{title}</TitleText>}
      />
    )
  }, [onPressItem, users])

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

        {renderList}
      </BottomSheet>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <View style={styles.contianer}>
            <ActivityIndicator size={'large'} color={Colors.ThemeColor} />
          </View>
        </View>
      )}
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
    padding: scale(20)
  },
  contianer: {
    width: verticalScale(100),
    height: verticalScale(100),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backDrop,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
