import React from 'react';
import { View,Text, FlatList } from 'react-native';
import { List, ListItem } from 'react-native-elements';

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }
    componentDidMount() {
        fetch('https://randomuser.me/api/?results=10', {
            method: 'get'
        }).then(res => res.json())
        .then(res => {
            this.setState({ users: res.results })
        })
    }

    renderItem = ({item}) => {
        const { name, email, picture } = item;
        return (
            <ListItem
                roundAvatar
                avatar={{ uri: picture.thumbnail }}
                title={`${name.first} ${name.last}`}
                subtitle={email}
            />
        )
    }

    render() {
        return(
            <List>
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderItem}
                />
            </List>
        )
    }
}

export default UsersList;
