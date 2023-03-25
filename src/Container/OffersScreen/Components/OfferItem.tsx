import React, {useCallback} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import styled from 'styled-components/native'

import English from '../../../Resources/Locales/English'
import {Colors, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {Fonts} from '../../../Theme/Fonts'
import {moderateScale, scale, verticalScale, widthPx} from '../../../Theme/Responsive'

const OfferItem = ({item}: any) => {
  const navigation: any = useNavigation()

  const onPressOffer = useCallback(() => {
    navigation.navigate(Screens.OfferDetailsScreen)
  }, [navigation])

  return (
    <TouchableOpacity onPress={onPressOffer} activeOpacity={0.5} style={styles.itmContainer}>
      <View style={styles.gradient}>
        <Label fontSize={moderateScale(14)} isBold color={Colors.ThemeColor}>
          {item?.title}
        </Label>
      </View>
      <RowView self>
        <Label self>{item?.created_at}</Label>
      </RowView>
      <RowView>
        <InnerView>
          <SellerImage source={Images.buyerSeller} />
          <Label>{English.R155}</Label>
          <Label isBold>{item?.buyer}</Label>
        </InnerView>
        <InnerView>
          <Label>{English.R157}</Label>
          <Label isBold>{item?.contractId}</Label>
        </InnerView>
      </RowView>
      <InnerView>
        <SellerImage source={Images.buyerSeller} />
        <Label>{English.R156}</Label>
        <Label isBold>{item?.seller}</Label>
      </InnerView>
    </TouchableOpacity>
  )
}

export default OfferItem

const styles = StyleSheet.create({
  itmContainer: {
    ...CommonStyles.shadow,
    borderRadius: moderateScale(15),
    marginVertical: verticalScale(10),
    padding: scale(10),
    width: widthPx(90),
    alignSelf: 'center'
  },
  gradient: {
    padding: scale(10),
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: moderateScale(15),
    backgroundColor: Colors.purpleEEE,
    borderTopLeftRadius: moderateScale(15)
  }
})

const SellerImage = styled.Image`
  width: ${verticalScale(15)}px;
  height: ${verticalScale(15)}px;
  margin-left: ${scale(5)}px;
  margin-right: ${scale(5)}px;
`

const InnerView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${verticalScale(5)}px;
  margin-bottom: ${verticalScale(5)}px;
`

const RowView = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: ${(props: any) => (props?.self ? 'flex-end' : 'space-between')};
  padding-bottom: ${(props: any) => (props?.self ? verticalScale(5) : 0)};
  margin-bottom: ${(props: any) => (props?.self ? verticalScale(10) : 0)};
`

const Label = styled.Text`
  color: ${(props: any) => props?.color ?? Colors.greyShade9797};
  font-size: ${(props: any) => props?.fontSize ?? moderateScale(12)};
  font-family: ${(props: any) => (props?.isBold ? Fonts.ThemeBold : Fonts.ThemeMedium)};
`
