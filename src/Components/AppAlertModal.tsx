import React from 'react'
import {Dimensions, ImageSourcePropType, StyleSheet} from 'react-native'
import ReactNativeModal from 'react-native-modal'
import styled from 'styled-components/native'

import {Colors, Images} from '../Theme'
import {GettingText} from '../Theme/CommonStyles'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../Theme/Responsive'
import AppButton from './AppButton'
import BackButton from './BackButton'

interface AppAlertModalProps {
  onClose?: () => void
  topText?: string
  middleText?: string
  onPress?: () => void
  btnText?: string
  image?: ImageSourcePropType
  isVisible?: boolean
}
const AppAlertModal = (props: AppAlertModalProps) => {
  const {
    onClose = () => {},
    onPress = () => {},
    topText = '',
    middleText = '',
    btnText = '',
    image,
    isVisible = false
  } = props
  const {height} = Dimensions.get('screen')

  return (
    <ReactNativeModal deviceHeight={height} statusBarTranslucent isVisible={isVisible}>
      <Container>
        <BackButton
          onPress={onClose}
          imageStyle={styles.imageStyle}
          parentStyle={styles.closeImage}
          image={Images.close}
          isHeader
          colors={[Colors.greyShadeFAF7, Colors.greyShadeEFF]}
          style={styles.btnStyle}
        />
        {image && <ImageContainer source={image} resizeMode={'contain'} />}
        <InnerContainer>
          <GettingText isCenter>{topText}</GettingText>
          <CreateAnAccountText isCenter>{middleText}</CreateAnAccountText>
        </InnerContainer>
        <AppButton
          title={btnText}
          onPress={() => {
            onClose()
            onPress()
          }}
          textStyle={styles.textStyle}
        />
      </Container>
    </ReactNativeModal>
  )
}

export default AppAlertModal
const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: 28px;
  padding: 10px;
  align-items: center;
  padding-bottom: ${verticalScale(29)}px;
  padding-top: ${verticalScale(40)}px;
`

const ImageContainer = styled.Image`
  margin-top: 10px;
  margin-bottom: 10px;
`

const InnerContainer = styled.View`
  width: 90%;
`
export const CreateAnAccountText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: ${moderateScale(14)}px;
  color: ${Colors.greyShade9797};
  text-align: ${(props: any) => (props.isCenter ? 'center' : 'left')};
  margin-bottom: 10px;
`
const styles = StyleSheet.create({
  closeImage: {
    position: 'absolute',
    right: scale(10),
    top: verticalScale(10),
    borderRadius: moderateScale(15)
  },
  imageStyle: {
    width: '35%',
    height: '35%',
    tintColor: Colors.greyShade595
  },
  textStyle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.ThemeMedium
  },
  btnStyle: {
    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: moderateScale(10)
  }
})
