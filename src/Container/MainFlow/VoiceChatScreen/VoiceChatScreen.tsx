import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import {AppState, Image, Platform, ScrollView, StyleSheet, TextInput} from 'react-native'
import {openSettings} from 'react-native-permissions'
import Sound from 'react-native-sound'
import {useDispatch, useSelector} from 'react-redux'
import useState from 'react-usestateref'
import Voice from '@react-native-voice/voice'
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import Filter from 'bad-words'
import _, {debounce} from 'lodash'
import Lottie from 'lottie-react-native'
import styled from 'styled-components/native'
import {v4 as uuid} from 'uuid'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AlertLoader from '../../../Components/AlertLoader'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import IosBottomButtonAvoid from '../../../Components/IosBottomButtonAvoid'
import {AnimatedTabBar} from '../../../Packages/curved-bottom-navigation-bar/src/AnimatedTabBar'
import {setPlanData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Colors, Constant, Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import Permission from '../../../Theme/Permission'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import {ChatDataType, SpeechResultsType} from '../../../types/Types'
import ChatListView from './Components/ChatListView'
import TransScriptBottomSheet from './Components/TransscriptBottomsheet'
import VoiceDataItem from './Components/VoiceDataItem'
import VoiceFirstView from './Components/VoiceFirstView'
import VoiceTextItem from './Components/VoiceTextItem'

const VoiceChatScreen = () => {
  const [viewIndex, setViewIndex] = useState(0) // Screen Change IDS 0,1,2
  const [data, setData, dataRef] = useState<ChatDataType[]>([]) // messages array[]
  const [isRecording, setISrecording] = useState(false) // react native voice is working or not
  const [playing, setPlaying, isPlayRef] = useState(false) // is response audio is playing or not
  const [text, setText] = useState('') // user input text
  const [isVoice, setISVoice, isVoiceRef] = useState(false) // is voice button is pressed or not
  const [loadingID, setLoadingID, loadingRef] = useState('') // loading ID is used to identify which item is loading right now
  const [contract, setContract] = useState(null) // catche id is come from last reeva response (after successfully contract created)
  const plan_details = useSelector((state: any) => state?.user?.userData?.plan_details)
  const navigation: any = useNavigation()
  const lottieRef = useRef<Lottie>(null) // lottie animation ref
  const scrollRef = useRef<ScrollView>(null) // used to scroll to bottom of list
  const isIOS = Platform.OS === 'ios' // is IOS or not
  const inputRef = useRef<TextInput>(null) // ref for input text
  const index = useRef(0)
  const silenceTimer = useRef<number>() // timer for silence required for IOS voice text
  const isCalled = useRef<boolean>(false) // timer for silence required for IOS voice text
  const isFocusRef = useRef(false)
  const isFocus = useIsFocused() // is screen focused or not
  const route: any = useRoute().params // route params
  const isDrawer = route?.isDrawer // is drawer screen or not
  const isRecordStart = useRef(false)
  const dispatch = useDispatch()

  const filter = useMemo(
    () =>
      new Filter({
        placeHolder: ' '
      }),
    []
  )

  const beep = useMemo(() => new Sound('beep.mp3', Sound.MAIN_BUNDLE, () => {}), [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollToEnd({
        animated: true
      })
    }
  }, [data])

  useEffect(() => {
    if (lottieRef.current && !isRecording) {
      lottieRef.current?.reset()
    }
  }, [isRecording])

  const tabs = useMemo(
    () => [
      {
        key: 'Good',
        title: 'good',
        icon: () => (
          <Image
            style={{
              width: verticalScale(25),
              height: verticalScale(25)
            }}
            source={Images.mic}
          />
        )
      },
      {
        key: 'bad',
        title: 'bad',
        icon: () => <Image source={Images.chat} />
      },
      {
        key: 'bad1',
        title: 'bad1',
        icon: () => <Image source={Images.chat} />
      }
    ],
    []
  )

  const onSendMsg = useCallback(
    async (text: string, isFromVoice = false) => {
      const isInternet = await Utility.isInternet()
      if (!isInternet) {
        return
      }

      if (loadingRef.current) {
        return
      }

      if (_.trim(text)) {
        const lastItemIndex = _.findLastIndex(dataRef.current, (i) =>
          Boolean(i?.payload?.instruction && i?.payload?.instruction !== 'error')
        )

        setText('')
        if (!isFromVoice) {
          setData((state) => {
            const clone: ChatDataType[] = JSON.parse(JSON.stringify(state))
            clone.push({
              id: uuid(),
              payload: {
                text
              },
              isMe: false
            })

            index.current = clone?.length + 1
            return clone
          })
        }
        await Utility.wait(200)

        if (!dataRef.current[isFromVoice ? index.current + 1 : index.current]) {
          setData((state) => {
            const clone: ChatDataType[] = JSON.parse(JSON.stringify(state))
            clone.push({
              id: uuid(),
              payload: {
                text: ''
              },
              isMe: true
            })
            index.current = clone?.length - 1

            return clone
          })
          setLoadingID(dataRef.current[index.current]?.id)
        }
        await Utility.wait(200)
        if (scrollRef.current) {
          scrollRef.current?.scrollToEnd({
            animated: true
          })
        }
        const payload: any = {
          prompt: Utility.addSpaceToDollarNumber(text)
        }

        if (dataRef.current[lastItemIndex]?.payload?.instruction) {
          payload.instruction = dataRef.current[lastItemIndex]?.payload?.instruction
        }

        APICall('post', payload, EndPoints.sendPrompt)
          .then(async (resp: any) => {
            isCalled.current = false
            setLoadingID('')
            if (resp?.status === 200 && resp?.data) {
              if (
                _.includes(resp?.data?.instruction, 'success') &&
                !(
                  _.includes(resp?.data?.transcript, 'Contact') ||
                  _.includes(resp?.data?.transcript, 'contact')
                )
              ) {
                const contractsResponse: any = await APICall('get', {}, EndPoints.getOffers).catch(
                  () => {}
                )
                const contract = _.find(
                  contractsResponse?.data?.contracts,
                  (i) => i?.filled_form === `/${resp?.data?.transcript}`
                )

                setContract(contract)
                setViewIndex(2)
                if (plan_details?.plan_name === Constant.Plans.Free) {
                  dispatch(
                    setPlanData({
                      monthly_contracts: Number(plan_details?.monthly_contracts || 0) + 1
                    })
                  )
                }
                return
              }
              if (resp?.data?.transcript) {
                setLoadingID('')
                setData((state) => {
                  const clone: ChatDataType[] = JSON.parse(JSON.stringify(state))
                  clone[index.current].payload = {
                    text: resp?.data?.transcript,
                    instruction: resp?.data?.instruction,
                    voice_id: resp?.data?.voice_id
                  }
                  index.current = clone?.length
                  return clone
                })
              }
            }
          })
          .catch((e) => {
            if (e?.status === 500) {
              setData((state) => {
                const clone: ChatDataType[] = JSON.parse(JSON.stringify(state))
                clone[index.current].payload = {
                  text: 'Hmm, Something went wrong. We are working on server. Please try again after sometimes.',
                  instruction: 'error',
                  voice_id: ''
                }
                index.current = clone?.length
                return clone
              })
            }
            isCalled.current = false
            setLoadingID('')
          })
      }
    },
    [
      dataRef,
      dispatch,
      loadingRef,
      plan_details?.monthly_contracts,
      plan_details?.plan_name,
      setData,
      setLoadingID
    ]
  )

  const onPressReset = useCallback(() => {
    setViewIndex(0)
    setData([])
    setISrecording(false)
    setPlaying(false)
    index.current = 0
    setText('')
    setISVoice(false)
    setLoadingID('')
    setContract(null)
    isRecordStart.current = false
  }, [setData, setISVoice, setLoadingID, setPlaying])

  const stopRecognizing = useCallback(() => {
    return new Promise<boolean>(async (resolve) => {
      if (Platform.OS === 'ios') {
        await Voice.cancel()
      }
      await Voice.stop()
      resolve(true)
    })
  }, [])

  const debouncedSendRequest = debounce(
    (text, isVoiceEnabled) => onSendMsg(text, isVoiceEnabled),
    1000
  )

  const startRecognizing = useCallback(() => {
    return new Promise<boolean>(async (resolve) => {
      if (isVoiceRef.current) {
        Permission.getMicPermission().then(async (resp) => {
          if (resp) {
            await Utility.wait(500)
            const isRecognizing = await Voice.isRecognizing()
            if (!isRecognizing) {
              Voice.start('en-US')
                .then(() => {
                  resolve(true)
                })
                .catch((e) => {
                  resolve(e)
                })
            }
          } else {
            setISVoice(false)
            isRecordStart.current = false
            setViewIndex(0)
            AlertLoader.show(English.R208, [
              {
                title: 'Cancel',
                style: 'cancel'
              },
              {
                title: English.R206,
                onPress: openSettings
              }
            ])
          }
        })
      }
    })
  }, [isVoiceRef, setISVoice])

  const onFocusScreen = useCallback(async () => {
    isFocusRef.current = isFocus
    if (isFocus) {
      if (isVoiceRef.current) {
        await startRecognizing()
        isRecordStart.current = true
      }
    } else {
      await stopRecognizing()
      isRecordStart.current = false
    }
  }, [isFocus, isVoiceRef, startRecognizing, stopRecognizing])

  const permiumAlert = useCallback(() => {
    AlertLoader.show(English.R208, [
      {
        title: 'OK',
        style: 'cancel'
      },
      {
        title: English.R209,
        onPress: () => {
          navigation.navigate(Screens.PremiumPlanScreen, {
            initialIndex: 2
          })
        }
      }
    ])
  }, [navigation])

  const onIndexChange = useCallback(
    async (index: number) => {
      if (index === 0) {
        const isMic = await Permission.getMicPermission()

        if (isMic) {
          setISVoice(true)
          beep.play(() => beep.stop())
          await startRecognizing()
          isRecordStart.current = true
        }
      } else if (index === 3) {
        permiumAlert()
      } else {
        setISVoice(false)
        await stopRecognizing()
        isRecordStart.current = false
      }
    },
    [beep, permiumAlert, setISVoice, startRecognizing, stopRecognizing]
  )

  const onEndSpeech = useCallback(
    async (text: string) => {
      await stopRecognizing()
      setISrecording(false)
      isRecordStart.current = false
      if (isCalled.current) {
        return
      }
      debouncedSendRequest(text, true)
      isCalled.current = true
    },
    [debouncedSendRequest, stopRecognizing]
  )

  const setVoiceData = useCallback(
    (e: SpeechResultsType, isActual = false) => {
      setISrecording(!!_.trim(e?.value[0]))

      if (e?.value?.length > 0 && !!_.trim(e?.value[0])) {
        const cleanText = filter?.clean(e?.value[0])
        if (!dataRef.current[index.current]) {
          setData((state) => {
            const clone: ChatDataType[] = JSON.parse(JSON.stringify(state))

            if (!_.trim(cleanText)) {
              return clone
            }

            clone.push({
              id: uuid(),
              payload: {
                text: _.trim(cleanText)
              },
              isMe: false
            })
            index.current = clone?.length - 1
            return clone
          })
        } else {
          setData((state) => {
            const clone: ChatDataType[] = JSON.parse(JSON.stringify(state))
            if (!_.trim(cleanText)) {
              return clone
            }
            clone[index.current].payload.text = _.trim(cleanText)
            return clone
          })
        }
      }

      if (e?.value[0] && isActual) {
        onEndSpeech(e?.value[0])
      } else {
        if (silenceTimer.current) clearTimeout(silenceTimer.current)
        silenceTimer.current = setTimeout(async () => {
          onEndSpeech(e?.value[0])
        }, 2000)
      }
    },
    [dataRef, filter, onEndSpeech, setData]
  )

  useEffect(() => {
    onFocusScreen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus])

  useEffect(() => {
    Voice.onSpeechStart = () => {}
    Voice.onSpeechResults = (e: any) => {
      if (isVoiceRef.current) {
        setVoiceData(e, !isIOS)
      }
    }

    Voice.onSpeechEnd = async () => {
      if (isRecordStart.current && !(isPlayRef.current || isIOS)) {
        await startRecognizing()
      }
    }
    Voice.onSpeechError = async (e) => {
      if (!isFocusRef.current) {
        return
      }
      if (
        isIOS &&
        isRecordStart.current &&
        e?.error?.code !== 'recognition_fail' &&
        isRecordStart.current
      ) {
        await startRecognizing()
        return
      }

      if (isRecordStart.current && !(isPlayRef.current || isIOS)) {
        await startRecognizing()
      }
    }
    Voice.onSpeechPartialResults = (e: any) => {
      setViewIndex(1)
      if (isVoiceRef.current && !isIOS) {
        setVoiceData(e)
      }
    }

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPlayBackStateChange = useCallback(
    async (state: boolean) => {
      setPlaying(state)
      if (state) {
        stopRecognizing()
      } else {
        if (inputRef.current) {
          inputRef.current?.focus()
        }
        if (isVoiceRef.current) {
          beep.play(() => beep.stop())
        }
        await startRecognizing()
        isRecordStart.current = true
      }
    },
    [beep, isVoiceRef, setPlaying, startRecognizing, stopRecognizing]
  )

  useEffect(() => {
    AppState.addEventListener('change', async (state) => {
      isFocusRef.current = state === 'active'
      if (state === 'active') {
        if (isVoiceRef.current) {
          await startRecognizing()
          isRecordStart.current = true
        }
      } else {
        await stopRecognizing()
        isRecordStart.current = false
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onAnimationEnd = useCallback(
    (state: boolean) => {
      setPlaying(state)
      if (scrollRef.current) {
        scrollRef.current?.scrollToEnd({
          animated: true
        })
      }
    },
    [setPlaying]
  )

  const renderItem = useCallback(
    ({item}: {item: ChatDataType}) => {
      return item?.isMe ? (
        <VoiceDataItem
          isSound={plan_details?.reeva_voice}
          onAnimationEnd={onAnimationEnd}
          onPlayBackStateChange={onPlayBackStateChange}
          data={item?.payload}
          key={item?.id}
          loading={loadingID === item?.id}
        />
      ) : (
        <VoiceTextItem key={item?.id} isDisabled={item?.isDisabled} data={item?.payload} />
      )
    },
    [loadingID, onAnimationEnd, onPlayBackStateChange, plan_details?.reeva_voice]
  )

  const renderFirstView = useMemo(() => {
    return <VoiceFirstView contract={contract} onPressReset={onPressReset} viewIndex={viewIndex} />
  }, [contract, onPressReset, viewIndex])

  const renderSecondVIew = useMemo(() => {
    return (
      <ChatListView
        data={data}
        isPlaying={playing}
        isRecording={!playing && !loadingID && isVoice}
        renderItem={renderItem}
        ref={scrollRef}
      />
    )
  }, [data, isVoice, loadingID, playing, renderItem])

  const renderTextInput = useMemo(() => {
    return (
      <AppInput
        inputStyle={styles.input}
        ContainerStyle={styles.input}
        placeholder={English.R106}
        onChangeText={setText}
        value={text}
        allowFontScaling
        autoCapitalize={'sentences'}
        autoCorrect={false}
        spellCheck={false}
        editable={!(loadingID || playing)}
        ref={inputRef}
        onSubmitEditing={(e) => {
          if (
            plan_details &&
            Number(plan_details?.monthly_contracts) >= Number(plan_details?.contract_limit) &&
            plan_details?.plan_name === Constant.Plans.Free
          ) {
            Utility.showAlert(
              'Your maximum limit for creating offers for the free plan has been over'
            )
            setText('')
            return
          }

          if (_.trim(e?.nativeEvent?.text)) {
            const cleanText = filter.clean(e?.nativeEvent?.text)
            if (_.trim(cleanText)) {
              setViewIndex(1)
              onSendMsg(_.trim(cleanText), false)
            } else {
              setText('')
            }
          }
        }}
        returnKeyType={'send'}
      />
    )
  }, [text, loadingID, playing, plan_details, onSendMsg, filter])

  const renderLottieAnimation = useMemo(() => {
    return (
      <Lottie
        style={styles.lottieStyle}
        autoPlay={isRecording}
        source={isRecording ? Images.animated : Images.static}
        loop
        ref={lottieRef}
        autoSize
        speed={1}
      />
    )
  }, [isRecording])

  return (
    <AppContainer isBottomSafeArea={false} style={styles.container}>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R184} />
      <AppScrollView
        style={CommonStyles.flex}
        nestedScrollEnabled
        scrollEnabled={false}
        contentContainerStyle={CommonStyles.flex}
      >
        {viewIndex === 0 || viewIndex === 2 ? renderFirstView : renderSecondVIew}

        {viewIndex === 2 && contract ? (
          <TransScriptBottomSheet contract={contract} />
        ) : (
          <AnimatedTabBar
            duration={500}
            onPress={onIndexChange}
            navigationIndex={isVoice ? 2 : 0}
            tabs={tabs}
            isTouchable={plan_details?.reeva_voice}
          >
            {isVoice ? renderLottieAnimation : renderTextInput}
          </AnimatedTabBar>
        )}
      </AppScrollView>
      <IosBottomButtonAvoid />
    </AppContainer>
  )
}

export default VoiceChatScreen

export const VoiceDemoView = styled.View`
  flex: 1;
  background-color: ${Colors.ThemeBackGround};
  align-items: center;
  align-content: center;
  justify-content: flex-end;
  margin-bottom: 10px;
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

  input: {
    height: verticalScale(45)
  },
  lottieStyle: {
    height: verticalScale(40),
    top: verticalScale(10),
    transform: [
      {
        scale: 2.5
      }
    ],
    width: '60%',
    alignSelf: 'center'
  }
})
