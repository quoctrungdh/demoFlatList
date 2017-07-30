import React from 'react';
import { View, Text, FlatList,ActivityIndicator } from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';

import { borderColor } from '../constants';

const _XHR = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest
XMLHttpRequest = _XHR

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: 1,
            page: 1,
            users: [],
            isLoading: false,
            refreshing: false
        }
    }

    componentDidMount() {
        this.fetchUsersData();
    }

    fetchUsersData = () => {
        const { seed, page } = this.state;

        return fetch(`https://randomuser.me/api/?results=10&seed=${seed}&page=${page}`, {
            method: 'get'
        }).then(res => res.json())
        .then(res => {
            this.setState({
                users: page === 1 ? res.results : [...this.state.users, ...res.results],
                refreshing: false,
            })
        })
        .catch(err => {
            this.setState({
                refreshing: false,
            })
        })
    }

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Search..."
                lightTheme
            />
        )
    }

    renderItem = ({item}) => {
        const { name, email, picture } = item;
        return (
            <ListItem
                roundAvatar
                avatar={{ uri: picture.thumbnail }}
                title={`${name.first} ${name.last}`}
                subtitle={email}
                containerStyle={{ borderBottomWidth: 0 }}
            />
        )
    }

    renderSeperator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: borderColor,
                    marginLeft: "14%"
                }}
            />
        )
    }

    renderFooter = () => {
        if (this.state.loading) {
            return null;
        }

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: borderColor
                }}
            >
                <ActivityIndicator
                    size="large"
                    animating
                />
            </View>
        )
    }

    handleRefresh = () => {
        this.setState({
            page: 1,
            refreshing: true,
            seed: this.state.seed + 1,
        }, () => {
            this.fetchUsersData();
        })
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.fetchUsersData();
        })
    }

    render() {
        return(
            <List
                containerStyle={{ borderTopWidth: 0 }}
            >
                <FlatList
                    ListHeaderComponent={this.renderHeader}
                    data={this.state.users}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeperator}
                    ListFooterComponent={this.renderFooter}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={30}
                />
            </List>
        )
    }
}

export default UsersList;
