import React, {memo, useCallback, useMemo} from 'react'
import {Image, Keyboard, StyleSheet, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Skeleton from '@thevsstech/react-native-skeleton'
import styled from 'styled-components/native'

import BackButton from '../../../../Components/BackButton'
import {Colors, Images, Screens} from '../../../../Theme'
import {CommonStyles} from '../../../../Theme/CommonStyles'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale, widthPx} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'
import TextToImage from './TextToImage'

const ContactItem = ({
  item,
  isLoading = false,
  isFromTemplate = false,
  isSelectList = false,
  onPress,
  offerItem
}: any) => {
  const navigation: any = useNavigation()

  const onPressContact = useCallback(() => {
    if (onPress) {
      onPress()
    } else {
      Keyboard.dismiss()

      if (offerItem) {
        if (!item?.email) {
          navigation.navigate(Screens.ContactDetailsScreen, {
            data: item,
            isOfferScreen: true,
            offerItem
          })
        } else {
          navigation.navigate(Screens.OfferDetailsScreen, {
            contactItem: {...(offerItem || {}), email: item?.email},
            isOfferScreen: true
          })
        }

        return
      }
      navigation.navigate(Screens.ContactDetailsScreen, {
        data: item
      })
    }
  }, [item, navigation, offerItem, onPress])

  const onPressShare = useCallback(() => {
    Keyboard.dismiss()
    if (!item?.email) {
      navigation.navigate(Screens.ContactDetailsScreen, {
        data: item,
        offerItem,
        isTemplateScreen: true
      })
    } else {
      navigation.navigate(Screens.OfferDetailsScreen, {
        item: offerItem,
        contactItem: item
      })
    }
  }, [offerItem, item, navigation])

  const renderImageText = useMemo(() => {
    return <TextToImage fontSize={15} isLoading={isLoading} text={item?.value} />
  }, [item?.value, isLoading])

  const renderNumberView = useMemo(() => {
    return (
      <View style={CommonStyles.flex}>
        {isLoading ? (
          <Skeleton>
            <Skeleton.Item width={widthPx(30)} height={verticalScale(25)} borderRadius={4} />
            <Skeleton.Item
              marginTop={verticalScale(5)}
              width={widthPx(30)}
              height={verticalScale(25)}
              borderRadius={4}
            />
          </Skeleton>
        ) : (
          <>
            <NameText>{item?.value}</NameText>
            <NumberText>{Utility.formateNumber(item?.number)}</NumberText>
          </>
        )}
      </View>
    )
  }, [isLoading, item?.number, item?.value])

  const renderButton = useMemo(() => {
    return isSelectList ? (
      <CheckBox isSelected={item?.isSelected}>
        <Image source={Images.right} style={styles.checkImageStyle} />
      </CheckBox>
    ) : isLoading ? (
      <Skeleton>
        <Skeleton.Item width={verticalScale(30)} height={verticalScale(30)} borderRadius={4} />
      </Skeleton>
    ) : isFromTemplate ? (
      <BackButton
        isHeader
        colors={[Colors.white, Colors.white]}
        imageStyle={styles.imageStyle2}
        style={styles.btnStyle2}
        onPress={onPressShare}
        image={Images.send}
      />
    ) : (
      <BackButton
        isHeader
        imageStyle={styles.imageStyle}
        style={styles.btnStyle}
        disabled
        image={Images.rightTriangle}
      />
    )
  }, [isFromTemplate, isLoading, isSelectList, item?.isSelected, onPressShare])

  return (
    <ContactContainer onPress={() => (!isFromTemplate ? onPressContact() : onPressShare())}>
      {renderImageText}
      {renderNumberView}
      {renderButton}
    </ContactContainer>
  )
}

export default memo(ContactItem)

export const ContactContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: ${verticalScale(20)}px;
  margin-left: ${verticalScale(20)}px;
`

export const ImageContainer = styled.Image`
  width: ${verticalScale(50)}px;
  height: ${verticalScale(50)}px;
  border-radius: 15px;
  margin-right: ${scale(15)}px;
  margin-left: ${scale(15)}px;
`

export const NameText = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-family: ${Fonts.ThemeMedium};
  color: ${Colors.blackShade2A30};
`

export const NumberText = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-family: ${Fonts.ThemeMedium};
  color: ${Colors.greyCDCFD0};
`

const CheckBox = styled.View`
  background-color: ${(props: any) => (props?.isSelected ? Colors.ThemeColor : Colors.white)};
  height: ${verticalScale(20)}px;
  width: ${verticalScale(20)}px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  border-color: ${Colors.ThemeColor};
  border-width: 1.5px;
`

const styles = StyleSheet.create({
  btnStyle: {
    width: verticalScale(30),
    height: verticalScale(30),
    borderRadius: moderateScale(10)
  },
  imageStyle: {
    tintColor: Colors.black
  },
  checkImageStyle: {
    height: '70%',
    width: '70%',
    tintColor: Colors.white
  },
  btnStyle2: {
    marginRight: scale(15),
    borderRadius: moderateScale(10)
  },
  imageStyle2: {
    tintColor: Colors.ThemeColor
  }
})
