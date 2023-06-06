import React, {Component} from 'react'
import {SectionList, SectionListProps} from 'react-native'
import _ from 'lodash'

import {CommonStyles} from '../Theme/CommonStyles'
import EmptyComponent from './EmptyComponent'

interface CustomSectionListProps extends SectionListProps<any, any> {
  sections: any[]
  searchAttribute: string
  searchTerm: string
  ignoreCase?: boolean
  searchByTitle?: boolean
  stickySectionHeadersEnabled?: boolean
  Component?: any
}

export default class CustomSectionList extends Component<CustomSectionListProps> {
  static defaultProps = {
    searchAttribute: '',
    searchByTitle: false,
    ignoreCase: true,
    stickySectionHeadersEnabled: true,
    Component: SectionList
  }

  render() {
    const {
      sections,
      searchAttribute,
      searchTerm,
      ignoreCase,
      searchByTitle,
      Component = SectionList
    } = this.props

    const sectionsData = _.reduce(
      sections,
      (result: any, {title, data}) => {
        const filteredData = _.filter(data, (item) => {
          const searchDataItem = searchByTitle ? title : _.get(item, searchAttribute, item)

          return ignoreCase
            ? _.includes(_.toLower(searchDataItem), _.toLower(searchTerm))
            : _.includes(searchDataItem, searchTerm)
        })

        if (filteredData.length) {
          result.push({title, data: filteredData})
        }

        return result
      },
      []
    )

    return (
      <Component
        stickySectionHeadersEnabled
        // bounces={false}
        contentContainerStyle={sectionsData.length === 0 && CommonStyles.flex}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        {...this.props}
        ListEmptyComponent={() => <EmptyComponent />}
        sections={sectionsData}
      />
    )
  }
}
