import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import {FlatList, LayoutAnimation, Platform, StyleSheet, TextInput, UIManager} from 'react-native'
import useState from 'react-usestateref'
import Voice from '@react-native-voice/voice'
import {useRoute} from '@react-navigation/native'
import _ from 'lodash'
import styled from 'styled-components/native'
import {v4 as uuid} from 'uuid'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppInput from '../../../Components/AppInput'
import AppScrollView from '../../../Components/AppScrollView'
import {AnimatedTabBar} from '../../../Packages/curved-bottom-navigation-bar/src/AnimatedTabBar'
import English from '../../../Resources/Locales/English'
import {Colors, Images} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import Permission from '../../../Theme/Permission'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import ChatListView from './Components/ChatListView'
import TransScriptBottomSheet from './Components/TransscriptBottomsheet'
import VoiceDataItem from './Components/VoiceDataItem'
import VoiceFirstView from './Components/VoiceFirstView'
import VoiceTextItem from './Components/VoiceTextItem'

const VoiceChatScreen = () => {
  const [, setResult, resultRef] = useState<string>('')
  const [viewIndex, setViewIndex, viewIndexRef] = useState(0)
  const [data, setData, dataRef] = useState<any[]>([])
  const silenceTimer = useRef<number>()
  const [isRecording, setISrecording] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const [playing, setPlaying, isPlayRef] = useState(false)
  const index = useRef(0)
  const [text, setText] = useState('')
  const route: any = useRoute().params
  const [isVoice, setISVoice, isVoiceRef] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<TextInput>()
  const [catche_id, setCatche_ID] = useState('')
  const layoutAnimationProps = useMemo(() => {
    return {
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      }
    }
  }, [])

  const isDrawer = route?.isDrawer

  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }

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
            id: uuid(),
            payload: {
              text: e?.value[0]
            },
            isMe: false
          })
          index.current = clone?.length - 1

          LayoutAnimation.configureNext(layoutAnimationProps)

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

        onSendMsg(resultRef.current, true)

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
    LayoutAnimation.configureNext(layoutAnimationProps)

    Voice.onSpeechStart = () => {
      setViewIndex(1)
    }
    Voice.onSpeechResults = (e: any) => {
      if (Platform.OS === 'ios' && viewIndexRef.current === 1) {
        setVoiceData(e)
      }
    }
    Voice.onSpeechEnd = async () => {
      if (isPlayRef.current || Platform.OS === 'ios') {
        return
      }
      await startRecognizing()
    }
    Voice.onSpeechError = async (e) => {
      if (isPlayRef.current || Platform.OS === 'ios') {
        return
      }
      await startRecognizing()
    }
    Voice.onSpeechPartialResults = (e: any) => {
      if (Platform.OS === 'android' && viewIndexRef.current === 1) {
        setVoiceData(e)
      }
    }

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSendMsg = useCallback(
    (text: string, isVoice = false) => {
      if (text) {
        const lastItemIndex = _.findLastIndex(
          data,
          (i: any) => i?.payload?.instruction && i?.payload?.instruction !== 'error'
        )

        setText('')

        setTimeout(() => {
          if (!isVoice) {
            setData((state) => {
              const clone = JSON.parse(JSON.stringify(state))
              clone.push({
                id: uuid(),
                payload: {
                  text
                },
                isMe: false
              })

              LayoutAnimation.configureNext(layoutAnimationProps)

              index.current = clone?.length + 1
              return clone
            })
          }

          const payload = {
            prompt: text,
            instruction: data[lastItemIndex]?.payload?.instruction || ''
          }
          setIsLoading(true)
          APICall('post', payload, EndPoints.sendPrompt)
            .then((resp: any) => {
              setIsLoading(false)
              if (resp?.status === 200 && resp?.data) {
                if (
                  _.includes(resp?.data?.instruction, 'success') &&
                  !_.includes(resp?.data?.transcript, 'Contact')
                ) {
                  setCatche_ID(resp?.data?.transcript)
                  setViewIndex(2)
                  return
                }
                if (resp?.data?.transcript) {
                  setData((state) => {
                    const clone = JSON.parse(JSON.stringify(state))
                    clone.push({
                      id: uuid(),
                      payload: {
                        text: resp?.data?.transcript,
                        instruction: resp?.data?.instruction,
                        audio: Utility.getRandomSentenceWithDelay().audio
                      },
                      isMe: true
                    })

                    if (isVoice) {
                      index.current = clone?.length
                    }

                    LayoutAnimation.configureNext(layoutAnimationProps)

                    return clone
                  })
                }
              }
            })
            .catch(() => {
              setIsLoading(false)
            })
        }, 1000)
      }
    },
    [data, layoutAnimationProps, setData, setViewIndex]
  )

  const onPressReset = useCallback(() => {
    setResult('')
    setViewIndex(0)
    setData([])
    setISrecording(false)
    setPlaying(false)
    index.current = 0
    setText('')
    setISVoice(false)
    setIsLoading(false)
    setCatche_ID('')
  }, [setData, setISVoice, setPlaying, setResult, setViewIndex])

  const startRecognizing = useCallback(() => {
    return new Promise(async (resolve) => {
      Permission.getMicPermission().then(async (resp) => {
        if (resp && isVoiceRef.current) {
          await Voice.stop()
          await Voice.cancel()
          Voice.start('en-US')
            .then(() => {
              resolve(true)
            })
            .catch((e) => {
              resolve(e)
            })
        }
      })
    })
  }, [isVoiceRef])

  const onIndexChange = useCallback(
    async (index: number) => {
      if (index === 0) {
        setISVoice(true)
        startRecognizing()
      } else {
        setISVoice(false)
        await Voice.stop()
        await Voice.cancel()
      }
    },
    [startRecognizing, setISVoice]
  )

  const renderItem = useCallback(
    ({item}: any) => {
      return item?.isMe ? (
        <VoiceDataItem
          onPlayBackStateChange={async (state: boolean) => {
            setPlaying(state)
            if (state) {
              await Voice.cancel()
              await Voice.stop()
            } else {
              if (inputRef.current) {
                inputRef.current?.focus()
              }

              if (!(await Voice.isRecognizing())) {
                startRecognizing()
              }
            }
          }}
          data={item?.payload}
          loading={isLoading}
        />
      ) : (
        <VoiceTextItem data={item?.payload} />
      )
    },
    [isLoading, setPlaying, startRecognizing]
  )

  const renderFirstView = useMemo(() => {
    return <VoiceFirstView onPressReset={onPressReset} viewIndex={viewIndex} />
  }, [onPressReset, viewIndex])

  const renderSecondVIew = useMemo(() => {
    return (
      <ChatListView
        data={data}
        isPlaying={playing}
        isRecording={isRecording}
        renderItem={renderItem}
        ref={flatListRef}
      />
    )
  }, [data, isRecording, playing, renderItem])

  const renderTextInput = useMemo(() => {
    return (
      <AppInput
        inputStyle={styles.input}
        ContainerStyle={styles.input}
        placeholder={English.R106}
        onChangeText={setText}
        value={text}
        editable={!isLoading}
        ref={inputRef}
        onSubmitEditing={(e) => {
          setViewIndex(1)
          onSendMsg(e.nativeEvent.text)
        }}
        returnKeyType={'done'}
      />
    )
  }, [text, isLoading, setViewIndex, onSendMsg])

  return (
    <AppContainer isBottomSafeArea={false} style={styles.container}>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R95} />
      <AppScrollView style={CommonStyles.flex} contentContainerStyle={CommonStyles.flex}>
        {viewIndex === 0 || viewIndex === 2 ? renderFirstView : renderSecondVIew}

        {viewIndex === 2 && catche_id ? (
          <TransScriptBottomSheet catche_id={catche_id} />
        ) : (
          <AnimatedTabBar
            duration={500}
            onPress={onIndexChange}
            navigationIndex={isVoice ? 2 : 0}
            tabs={tabs}
          >
            {!isVoice ? (
              renderTextInput
            ) : (
              <WaveContainer resizeMode={'contain'} source={Images.wave} />
            )}
          </AnimatedTabBar>
        )}
      </AppScrollView>
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

  input: {
    height: verticalScale(40)
  }
})
