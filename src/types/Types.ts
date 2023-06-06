export type AudioFiles = Record<string, any>
export interface PayloadType {
  text?: string
  instruction?: string
  voice_id?: string
}
export interface ChatDataType {
  id: string
  payload: PayloadType
  isMe: boolean
  isDisabled?: boolean
}
export interface SpeechResultsType {
  value: string[]
}
