import {StyleSheet} from 'react-native'

import {verticalScale, W_HEIGHT, W_WIDTH} from '../Theme/Responsive'
import Colors from './Colors'

export const CommonStyles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.white
  },
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex: {
    flex: 1
  },
  rowView: {flexDirection: 'row', alignItems: 'center'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  onlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(5)
  },
  bodyStyle: {
    backgroundColor: Colors.white
  },
  fullView: {
    height: W_HEIGHT,
    width: W_WIDTH
  },
  viewFull: {
    height: '100%',
    width: '100%'
  },
  modalStyle: {
    padding: 0,
    margin: 0
  }
})
