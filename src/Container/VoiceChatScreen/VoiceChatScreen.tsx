import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import {FlatList, Platform, StyleSheet, View} from 'react-native'
import useState from 'react-usestateref'
import Voice from '@react-native-voice/voice'
import {useRoute} from '@react-navigation/native'
import _ from 'lodash'
import styled from 'styled-components/native'

import {CreateAnAccountText, GettingText} from '../../CommonStyle/AuthContainer'
import AppButton from '../../Components/AppButton'
import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppInput from '../../Components/AppInput'
import RippleAnimation from '../../Components/RippleAnimation'
import {AnimatedTabBar} from '../../Packages/curved-bottom-navigation-bar/src/AnimatedTabBar'
import English from '../../Resources/Locales/English'
import {Colors, Images} from '../../Theme'
import {CommonStyles} from '../../Theme/CommonStyles'
import Permission from '../../Theme/Permission'
import {moderateScale, scale, verticalScale} from '../../Theme/Responsive'
import Utility from '../../Theme/Utility'
import TransScriptBottomSheet from './Components/TransscriptBottomsheet'
import VoiceDataItem from './Components/VoiceDataItem'
import VoiceTextItem from './Components/VoiceTextItem'

const VoiceChatScreen = () => {
  const [, setResult, resultRef] = useState<string>('')
  const [viewIndex, setViewIndex] = useState(0)
  const [, setData, dataRef] = useState([])
  const silenceTimer = useRef<number>()
  const [isRecording, setISrecording] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const [playing, setPlaying, isPlayRef] = useState(false)
  const index = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [text, setText] = useState('')
  const route: any = useRoute().params

  const isDrawer = route?.isDrawer

  const onIndexChange = useCallback(
    (index: number) => {
      if (index === 0) {
        setCurrentIndex(2)
      } else {
        setCurrentIndex(0)
      }
    },
    [setCurrentIndex]
  )

  const tabs = useMemo(
    () => [
      {
        key: 'Good',
        title: 'good',
        icon: () => <IconContainer source={Images.mic} />
      },
      {
        key: 'bad',
        title: 'bad',
        icon: () => <IconContainer source={Images.chat} />
      },
      {
        key: 'bad1',
        title: 'bad1',
        icon: () => <IconContainer source={Images.chat} />
      }
    ],
    []
  )
  const setVoiceData = async (e: any) => {
    setISrecording(!!e?.value[0])
    if (e?.value?.length > 0) {
      setResult(e.value[0])

      if (!dataRef.current[index.current]) {
        setData((state) => {
          const clone = JSON.parse(JSON.stringify(state))
          clone.push({
            id: Math.random() + Date.now().toString(),
            payload: {
              text: e?.value[0]
            },
            isVoiceData: false
          })
          index.current = clone?.length - 1
          return clone
        })
      } else {
        setData((state) => {
          const clone = JSON.parse(JSON.stringify(state))
          clone[index.current].payload.text = e?.value[0]
          return clone
        })
      }
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true
      })
    }, 1000)

    if (silenceTimer.current) clearTimeout(silenceTimer.current)
    silenceTimer.current = setTimeout(async () => {
      if (resultRef?.current) {
        setISrecording(false)

        setData((state) => {
          const clone = JSON.parse(JSON.stringify(state))
          clone.push({
            id: Math.random() + Date.now().toString(),
            payload: Utility.getRandomSentenceWithDelay(),
            isVoiceData: true
          })
          index.current = clone?.length
          return clone
        })

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({
            animated: true
          })
        }, 1000)

        setResult('')
        await Voice.cancel()
      }
    }, 2000)
  }

  useEffect(() => {
    Permission.getMicPermission().then((resp) => {
      if (resp) {
        Voice.onSpeechStart = () => {}
        Voice.onSpeechResults = (e: any) => {
          if (_.includes(e?.value[0]?.toLowerCase(), 'reeva')) {
            setViewIndex(1)
          }
          if (Platform.OS === 'ios' && viewIndex === 1) {
            setVoiceData(e)
          }
        }
        Voice.onSpeechEnd = async () => {
          if (isPlayRef.current) {
            return
          }
          await startRecognizing()
        }
        Voice.onSpeechError = async (e) => {
          if (isPlayRef.current) {
            return
          }
          await startRecognizing()
        }
        Voice.onSpeechPartialResults = (e: any) => {
          if (_.includes(e?.value[0]?.toLowerCase(), 'reeva')) {
            setViewIndex(1)
          }
          if (Platform.OS === 'android' && viewIndex === 1) {
            setVoiceData(e)
          }
        }
        startRecognizing()
        return () => {
          Voice.destroy().then(Voice.removeAllListeners)
        }
      }
    })
  }, [])

  const startRecognizing = useCallback(async () => {
    return new Promise(async (resolve) => {
      await Voice.stop()
      await Voice.cancel()
      Voice.start('en-US')
        .then(() => {
          resolve(true)
        })
        .catch((e) => {
          resolve(e)
        })
    })
  }, [])

  const renderItem = useCallback(({item}: any) => {
    return item?.isVoiceData ? (
      <VoiceDataItem
        onPlayBackStateChange={async (state: boolean) => {
          setPlaying(state)
          if (state) {
            await Voice.cancel()
          } else {
            if (!(await Voice.isRecognizing())) {
              startRecognizing()
            }
          }
        }}
        data={item?.payload}
      />
    ) : (
      <VoiceTextItem data={item?.payload} />
    )
  }, [])

  const renderUserVoiceView = useMemo(() => {
    return (
      <RippleAnimation
        isAnimating={isRecording}
        imageUrl={'https://i.ibb.co/5nRvPXV/User.png'}
        color={Colors.greyShade9B9}
      />
    )
  }, [isRecording])

  const renderReevaVoiceView = useMemo(() => {
    return (
      <RippleAnimation
        isTop
        isAnimating={playing}
        imageUrl={'https://i.ibb.co/zPxNX46/Reeva.png'}
      />
    )
  }, [playing])

  const renderFirstView = useMemo(() => {
    return (
      <FirstContainer>
        <GettingText
          fontsize={moderateScale(24)}
          marginHorizontal={scale(20)}
          top={verticalScale(30)}
          isTopMargin
        >
          {'Hey Rizwan'}
        </GettingText>
        <CreateAnAccountText marginHorizontal={scale(20)}>
          {English.R98 + Utility.getTimeString()}
        </CreateAnAccountText>
        <RippleAnimation isTop size={200} imageUrl={'https://i.ibb.co/zPxNX46/Reeva.png'} />
        <GettingText isCenter>{English.R97}</GettingText>
        <CreateAnAccountText isCenter>
          {viewIndex === 0 ? English.R121 : English.R122}
        </CreateAnAccountText>
        {viewIndex === 2 && (
          <AppButton
            textStyle={styles.textStyle}
            style={styles.buttonStyle}
            onPress={() => {}}
            isGradient={false}
            title={English.R99}
          />
        )}
      </FirstContainer>
    )
  }, [])

  const renderSecondVIew = useMemo(() => {
    return (
      <>
        {renderReevaVoiceView}
        <View style={[CommonStyles.flex, CommonStyles.centerItem]}>
          <FlatList
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
            initialNumToRender={2}
            windowSize={2}
            data={_.slice(dataRef.current, -2)}
            ref={flatListRef}
            style={styles.flatlistStyle}
          />
        </View>
        {renderUserVoiceView}
      </>
    )
  }, [])

  const renderTextInput = useMemo(() => {
    return (
      <AppInput
        inputStyle={styles.input}
        ContainerStyle={styles.input}
        placeholder={English.R106}
        onChangeText={setText}
        value={text}
      />
    )
  }, [text, setText])

  return (
    <AppContainer isBottomSafeArea={false} style={styles.container}>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R95} />
      {viewIndex === 0 || viewIndex === 2 ? renderFirstView : renderSecondVIew}

      {viewIndex === 2 ? (
        <TransScriptBottomSheet />
      ) : (
        <AnimatedTabBar
          duration={500}
          onPress={onIndexChange}
          navigationIndex={currentIndex}
          tabs={tabs}
        >
          {currentIndex === 0 ? (
            renderTextInput
          ) : (
            <WaveContainer resizeMode={'contain'} source={Images.wave} />
          )}
        </AnimatedTabBar>
      )}
    </AppContainer>
  )
}

export default VoiceChatScreen

const FirstContainer = styled.View`
  flex: 1;
`

export const VoiceDemoView = styled.View`
  flex: 1;
  background-color: ${Colors.ThemeBackGround};
  align-items: center;
  align-content: center;
  justify-content: flex-end;
  margin-bottom: 10px;
`

export const IconContainer = styled.Image`
  width: ${verticalScale(30)}px;
  height: ${verticalScale(30)}px;
`

export const WaveContainer = styled.Image`
  width: 100%;
  height: ${verticalScale(40)}px;
  top: 15px;
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ThemeBackGround
  },

  flatlistStyle: {
    width: '100%'
  },
  buttonStyle: {
    width: '45%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.ThemeColor,
    borderWidth: 1,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  textStyle: {
    color: Colors.ThemeColor
  },
  input: {
    height: verticalScale(40)
  }
})
