import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { toJS } from 'mobx';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import moment from 'moment';

import PostStore from '@store/posts';
import Post from '@component/post';
import analytics from '@store/analytics';

import { GREY_LIGHT, GREY_MED_LIGHT, GREY_DARK } from '@theme/light';

@observer
class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.screenProps.category,
      postStore: null
    };
  }

  componentDidMount() {
    this.setState({
      postStore: new PostStore(this.state.category)
    });
    analytics.logEvent('View Main Page', {
      category: this.state.category
    });
  }

  renderPost(post) {
    return (
      <Post
        key={post.id}
        post={toJS(post)}
        navigation={this.props.navigation}
      />
    );
  }

  renderListItem(item) {
    let self = this;
    if (!item.posts.length) {
      return null;
    }
    return (
      <View key={item.date}>
        <View style={styles.dateContainer}>
          <Text style={styles.loadMoreText}>
            {moment(item.date).format('dddd, MMMM Do YYYY').toString()}
          </Text>
        </View>
        {item.posts.map(post => {
          return self.renderPost(post);
        })}
      </View>
    );
  }

  renderFooter() {
    if (this.state.postStore.isLoading) {
      return (
        <View style={styles.loadMoreContainer}>
          <Text style={styles.loadMoreText}>...</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.state.postStore.getPosts(this.state.category);
          }}
        >
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>View More</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  _onRefresh() {
    this.state.postStore.reload(this.state.category);
  }

  render() {
    let self = this;
    if (!this.state.category || !this.state.postStore) {
      return (
        <ActivityIndicator
          animating={true}
          style={[styles.centering, { height: 40 }]}
          color="black"
          size="small"
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.postStore.isLoading}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {this.state.postStore.listItems.map(item => {
            return self.renderListItem(item);
          })}
          {self.renderFooter()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    fontSize: 11,
    textAlign: 'center',
    padding: 5,
    marginLeft: 10
  },
  loadMoreText: {
    fontFamily: 'SFBold',
    fontSize: 25,
    marginLeft: 10,
    color: '#1a1a1a'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15
  },
  loadMoreContainer: {
    justifyContent: 'center',
    height: 50,
    marginTop: 10,
    marginBottom: 10
  },
  dateContainer: {
    marginTop: 20,
    marginBottom: 10,
    height: 40
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3'
  }
});

export default Screen;
