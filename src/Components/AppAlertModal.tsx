import React from 'react'
import {ImageSourcePropType, StyleSheet} from 'react-native'
import ReactNativeModal from 'react-native-modal'
import styled from 'styled-components/native'

import {GettingText} from '../CommonStyle/AuthContainer'
import {Colors, Images} from '../Theme'
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
}
const AppAlertModal = (props: AppAlertModalProps) => {
  const {
    onClose = () => {},
    onPress = () => {},
    topText = '',
    middleText = '',
    btnText = '',
    image
  } = props

  return (
    <ReactNativeModal isVisible>
      <Container>
        <BackButton
          onPress={onClose}
          imageStyle={styles.imageStyle}
          style={styles.closeImage}
          image={Images.close}
        />
        {image && <ImageContainer source={image} resizeMode={"contain"} />}
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
  width: ${verticalScale(180)}px;
  height: ${verticalScale(180)}px;
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
    backgroundColor: Colors.greyShadeEFF
  },
  imageStyle: {
    width: '45%',
    height: '45%',
    tintColor: Colors.greyShade595
  }
})
