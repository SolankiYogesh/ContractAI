import React, {useEffect, useMemo, useRef, useState} from 'react'
import {StyleSheet} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import ReactNativeModal from 'react-native-modal'
import BottomSheet, {BottomSheetBackdrop, BottomSheetSectionList} from '@gorhom/bottom-sheet'
import _ from 'lodash'

import AppInput from '../../../Components/AppInput'
import English from '../../../Resources/Locales/English'
import {Colors, Images} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {heightPx, moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import {TitleText} from '../../ContactListScreen/ContactListScreen'
import ShareItem from './ShareItem'

interface ShareBottomSheetProps {
  onClose?: () => void
  usersData?: any[]
}

const ShareBottomSheet = (props: ShareBottomSheetProps) => {
  const {onClose, usersData = []} = props
  const snapPoints = useMemo(() => [heightPx(80)], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<any[]>(usersData)
  const usersRef = useRef<any[]>(usersData)

  const bottomSheetStyle = {
    borderWidth: 2,
    borderRadius: moderateScale(15),
    borderColor: Colors.greyCDCFD0,
    padding: scale(20)
  }

  const handleIndicatorStyle = {
    backgroundColor: Colors.greyShadeEBEB,
    width: scale(50)
  }

  const handleStyle = {
    bottom: verticalScale(10)
  }

  useEffect(() => {
    if (!Utility.isEmpty(search)) {
      setUsers(usersRef.current)
    } else {
      const filter = _.filter(users, (i: any) => {
        return i?.value?.toLowerCase().indexOf(search?.toLowerCase()) > -1
      })
      setUsers(filter)
    }
  }, [search])

  const renderList = useMemo(() => {
    const DATA = _(users)
      .orderBy(['value'], ['asc'])
      .groupBy((item) => item?.value?.charAt(0)?.toUpperCase())
      .map((value, key) => ({title: key, data: value}))
      .value()
    return (
      <BottomSheetSectionList
        sections={DATA}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <ShareItem item={item} />}
        renderSectionHeader={({section: {title}}) => <TitleText>{title}</TitleText>}
      />
    )
  }, [users])

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

  return (
    <ReactNativeModal
      backdropOpacity={0}
      isVisible
      statusBarTranslucent
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={CommonStyles.modalStyle}
    >
      <GestureHandlerRootView style={CommonStyles.flex}>
        <BottomSheet
          enablePanDownToClose
          onClose={onClose}
          ref={bottomSheetRef}
          handleIndicatorStyle={handleIndicatorStyle}
          handleHeight={verticalScale(10)}
          handleStyle={handleStyle}
          snapPoints={snapPoints}
          style={bottomSheetStyle}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior={'close'}
              {...props}
            />
          )}
        >
          {renderSearchInput}
          {renderList}
        </BottomSheet>
      </GestureHandlerRootView>
    </ReactNativeModal>
  )
}

export default ShareBottomSheet
const styles = StyleSheet.create({
  ContainerStyle: {
    width: '90%',
    alignSelf: 'center'
  }
})
