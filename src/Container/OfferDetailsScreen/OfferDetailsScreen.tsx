import React, {useEffect, useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import RenderHTML from 'react-native-render-html'
import {useRoute} from '@react-navigation/native'
import axios from 'axios'
import _ from 'lodash'

import AppContainer from '../../Components/AppContainer'
import AppHeader from '../../Components/AppHeader'
import AppScrollView from '../../Components/AppScrollView'
import BackButton from '../../Components/BackButton'
import English from '../../Resources/Locales/English'
import {Colors, Images} from '../../Theme'
import {CommonStyles} from '../../Theme/CommonStyles'
import {moderateScale, scale, W_WIDTH} from '../../Theme/Responsive'
import ShareBottomSheet from './Components/ShareBottomSheet'

const OfferDetailsScreen = () => {
  const [isShareSheet, setISShareSheet] = useState(false)
  const contentWidth = useMemo(() => W_WIDTH - moderateScale(15) * 2, [W_WIDTH])
  const [users, setUsers] = useState<any[]>([])
  const route: any = useRoute().params
  const offerName = route?.offerName

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://dummyjson.com/users',
      headers: {}
    }

    axios
      .request(config)
      .then((response) => {
        const items = response.data?.users
        if (items?.length > 0) {
          const filterData = _.map(items, (i: any) => {
            return {
              phone: i?.phone,
              value: i?.firstName + i?.lastName,
              image: i?.image,
              key: i?.id
            }
          })

          setUsers(filterData)
        }
      })
      .catch(() => {
        setUsers([])
      })
  }, [])

  return (
    <AppContainer>
      <AppHeader isBack title={offerName || English.R158} />
      <AppScrollView>
        <View style={styles.container}>
          <RenderHTML
            tagsStyles={{
              p: {
                color: Colors.blackShade2A30
              }
            }}
            contentWidth={contentWidth}
            source={{
              html: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                
                <p></p>
                
                <p></p>
                
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <p></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                
                <p></p>
                
                <p></p>
                
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <p></p>`
            }}
          />
        </View>
      </AppScrollView>
      <BackButton
        onPress={() => setISShareSheet(true)}
        colors={[Colors.ThemeColor, Colors.purpleShadB0]}
        style={styles.sendImage}
        image={Images.send}
        imageStyle={styles.imageStyle}
      />
      {isShareSheet && (
        <ShareBottomSheet usersData={users} onClose={() => setISShareSheet(false)} />
      )}
    </AppContainer>
  )
}

export default OfferDetailsScreen
const styles = StyleSheet.create({
  sendImage: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 0,
    right: scale(20)
  },
  imageStyle: {
    tintColor: Colors.white
  },
  container: {
    flex: 1,
    margin: scale(15),
    borderRadius: moderateScale(20),
    padding: scale(10),
    ...CommonStyles.shadow
  }
})
