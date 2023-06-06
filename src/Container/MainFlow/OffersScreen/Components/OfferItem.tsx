import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import Skeleton from '@thevsstech/react-native-skeleton'
import moment from 'moment'
import styled from 'styled-components/native'

import English from '../../../../Resources/Locales/English'
import {Colors, Images} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale, widthPx} from '../../../../Theme/Responsive'

const OfferItem = ({item, index, selectedIndex, onPress = () => {}, isLoading = false}: any) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(index)}
      activeOpacity={1}
      disabled={isLoading}
      style={[styles.itmContainer, selectedIndex === index && !isLoading && styles.focus]}
    >
      {isLoading ? (
        <Skeleton>
          <Skeleton.Item
            borderBottomRightRadius={moderateScale(15)}
            width={widthPx(40)}
            borderTopLeftRadius={moderateScale(15)}
            height={verticalScale(30)}
            borderRadius={4}
            padding={scale(10)}
            position={'absolute'}
            top={-10}
            left={-10}
          />
        </Skeleton>
      ) : (
        <View style={styles.gradient}>
          <Label
            ellipsizeMode={'tail'}
            numberOfLines={1}
            fontSize={moderateScale(14)}
            isBold
            color={Colors.ThemeColor}
          >
            {item?.address}
          </Label>
        </View>
      )}

      <RowView self>
        {isLoading ? (
          <Skeleton>
            <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
          </Skeleton>
        ) : (
          <Label self color={Colors.greyShade020}>
            {moment(item?.created).format('DD MMM YYYY')}
          </Label>
        )}
      </RowView>
      <RowView>
        {isLoading ? (
          <Skeleton>
            <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
          </Skeleton>
        ) : (
          <InnerView>
            <SellerImage source={Images.buyerSeller} />
            <Label>{English.R155}</Label>
            <Label isBold>{item?.buyer || '        -'}</Label>
          </InnerView>
        )}

        {/* {isLoading ? (
          <Skeleton>
            <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
          </Skeleton>
        ) : (
          <InnerView>
            <Label>{English.R157}</Label>
            <Label isBold>{item?.id}</Label>
          </InnerView>
        )} */}
      </RowView>
      {isLoading ? (
        <Skeleton>
          <Skeleton.Item
            marginTop={10}
            width={widthPx(30)}
            height={verticalScale(25)}
            borderRadius={4}
          />
        </Skeleton>
      ) : (
        <InnerView>
          <SellerImage source={Images.buyerSeller} />
          <Label>{English.R156}</Label>
          <Label isBold>{item?.seller || '        -'}</Label>
        </InnerView>
      )}
    </TouchableOpacity>
  )
}

export default OfferItem

const styles = StyleSheet.create({
  itmContainer: {
    // ...CommonStyles.shadow,
    borderRadius: moderateScale(15),
    marginVertical: verticalScale(10),
    padding: scale(10),
    width: widthPx(90),
    alignSelf: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.greyShade9C9D,
    shadowOffset: {
      width: 0,
      height: 16
    },
    shadowOpacity: 0.05,
    shadowRadius: 42,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.transparent
  },
  gradient: {
    padding: scale(10),
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: moderateScale(15),
    backgroundColor: Colors.purpleEEE,
    borderTopLeftRadius: moderateScale(15),
    width: '50%'
  },
  focus: {
    borderWidth: 1,
    borderColor: Colors.ThemeColor
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
  padding-bottom: ${(props: any) => (props?.self ? verticalScale(5) : 0)}px;
  margin-bottom: ${(props: any) => (props?.self ? verticalScale(10) : 0)}px;
`

const Label = styled.Text`
  color: ${(props: any) => props?.color ?? Colors.greyShade9797};
  font-size: ${(props: any) => props?.fontSize ?? moderateScale(12)}px;
  font-family: ${(props: any) => (props?.isBold ? Fonts.ThemeBold : Fonts.ThemeMedium)};
`
