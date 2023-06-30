import React, {useCallback, useMemo} from 'react'
import {StyleSheet, View} from 'react-native'
import Animated, {FadeInRight, FadeOutLeft} from 'react-native-reanimated'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'

import AppButton from '../../../../Components/AppButton'
import {CountText} from '../../../../Components/DrawerScreen'
import PremiumCount from '../../../../Components/PremiumCount'
import RippleAnimation from '../../../../Components/RippleAnimation'
import TouchText from '../../../../Components/TouchText'
import English from '../../../../Resources/Locales/English'
import {Colors, Constant, Screens} from '../../../../Theme'
import {CommonStyles, CreateAnAccountText, GettingText} from '../../../../Theme/CommonStyles'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'
import Utility from '../../../../Theme/Utility'

interface VoiceFirstViewProps {
  viewIndex: number
  onPressReset?: () => void
  contract?: any
}

const VoiceFirstView = ({
  viewIndex,
  onPressReset = () => {},
  contract = null
}: VoiceFirstViewProps) => {
  const user = useSelector((state: any) => state?.user?.userData)

  const navigation: any = useNavigation()

  const onPressOfferScreen = useCallback(() => {
    if (contract) {
      navigation.navigate(Screens.OfferDetailsScreen, {
        isOfferScreen: true,
        contactItem: contract,
        isPreviewOnly: true
      })
    }
  }, [contract, navigation])

  const renderContractText = useMemo(() => {
    const ellipseTime = Number(contract?.elapsed_time || 0)
    const time = 30 * 60 - ellipseTime

    return (
      viewIndex === 2 && (
        <CountText
          marginBottom={verticalScale(30)}
          marginTop={verticalScale(5)}
          textAlign={'center'}
          color={Colors.blackShade236}
        >
          {English.R199}
          <CountText color={Colors.blackShade236} isBold>
            {new Date(time * 1000).toISOString().substring(14, 16)}
          </CountText>
          <CountText color={Colors.blackShade236}>{English.R202}</CountText>
        </CountText>
      )
    )
  }, [contract?.elapsed_time, viewIndex])

  return (
    <Animated.View
      exiting={FadeOutLeft.springify().delay(500)}
      entering={FadeInRight.springify().delay(500)}
    >
      <View style={CommonStyles.row}>
        <GettingText
          fontsize={moderateScale(24)}
          marginHorizontal={scale(20)}
          top={verticalScale(30)}
          isTopMargin
        >
          {English.R179 + user?.first_name}
        </GettingText>

        {user?.plan_details && user?.plan_details?.plan_name === Constant.Plans.Free && (
          <PremiumCount
            total={user?.plan_details?.contract_limit}
            current={user?.plan_details?.monthly_contracts}
            style={styles.rowContractContainer}
          />
        )}
      </View>
      <CreateAnAccountText fontsize={moderateScale(16)} marginHorizontal={scale(20)}>
        {English.R98 + Utility.getTimeString()}
      </CreateAnAccountText>
      <RippleAnimation isReeva isTop size={200} />

      <CreateAnAccountText marginHorizontal={scale(10)} isCenter>
        {viewIndex === 0 ? English.R121 : English.R122}
      </CreateAnAccountText>
      {viewIndex === 2 && (
        <AppButton
          textStyle={styles.textStyle}
          style={styles.buttonStyle1}
          onPress={onPressOfferScreen}
          isGradient={false}
          title={English.R196}
        />
      )}

      {renderContractText}

      {viewIndex === 2 && (
        <TouchText onPress={onPressReset} text={English.R99} style={styles.textStyle2} />
      )}
    </Animated.View>
  )
}

export default VoiceFirstView

const styles = StyleSheet.create({
  buttonStyle1: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.ThemeColor,
    borderWidth: 1,
    marginBottom: verticalScale(20)
  },
  textStyle: {
    color: Colors.ThemeColor
  },

  textStyle2: {
    alignSelf: 'center',

    marginBottom: 'auto'
  },
  rowContractContainer: {
    marginHorizontal: scale(20)
  }
})
