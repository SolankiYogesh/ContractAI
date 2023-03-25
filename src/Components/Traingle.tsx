import React from 'react'
import {StyleProp, ViewStyle} from 'react-native'
import styled from 'styled-components/native'

import {Colors} from '../Theme'

interface TriangleProps {
  size?: number
  color?: string
  styles?: StyleProp<ViewStyle>
}

const Triangle = (props: TriangleProps) => {
  const {size, color, styles = {}} = props
  return <TriangleContainer size={size} color={color} style={styles} />
}

export default Triangle
const TriangleContainer = styled.View`
  width: 0;
  height: 0;
  border-left-width: ${(props: any) => props?.size / 2}px;
  border-right-width: ${(props: any) => props?.size / 2}px;
  border-bottom-width: ${(props: any) => props?.size}px;
  border-left-color: ${Colors.transparent};
  border-right-color: ${Colors.transparent};
  border-bottom-color: ${(props: any) => props?.color};
`
