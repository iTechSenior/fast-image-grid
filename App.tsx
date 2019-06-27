import * as React from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  LayoutChangeEvent
} from "react-native";
import FastImage from "react-native-fast-image";

import { ImageItem } from "./src/types";

export interface IState {
  list: ImageItem[];
  itemHeight: number;
  error: boolean;
  loading: boolean;
}

const getImageUrl = (id: string, width: number, height: number): string =>
  `https://unsplash.it/${width}/${height}?image=${id}`;

export default class App extends React.Component<{}, IState> {
  state: IState = {
    list: [],
    itemHeight: 0,
    error: false,
    loading: false
  };

  componentDidMount() {
    this.setState({ loading: true });
    fetch("https://unsplash.it/list")
      .then(res => res.json())
      .then(images => this.setState({ list: images, loading: false }))
      .catch(err => this.setState({ list: [], error: true, loading: false }));
  }

  renderItem = ({ item }: { item: ImageItem }): React.ReactElement => {
    const uri = getImageUrl(item.id, 100, 100);
    return (
      <View style={styles.container}>
        <FastImage source={{ uri }} style={styles.image} />
      </View>
    );
  };

  extractKey = (item: ImageItem): string => item.id;

  onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    this.setState({ itemHeight: width / 4 });
  };

  getItemLayout = (data: ImageItem[] | null, index: number) => {
    const { itemHeight } = this.state;
    return { length: itemHeight, offset: itemHeight * index, index };
  };

  render() {
    const { list, itemHeight, error, loading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {error ? (
          <Text>Error fetching images</Text>
        ) : loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList<ImageItem>
            data={list}
            numColumns={4}
            renderItem={this.renderItem}
            keyExtractor={this.extractKey}
            getItemLayout={this.getItemLayout}
            onLayout={this.onLayout}
            style={styles.list}
            columnWrapperStyle={[styles.columnWrapper, { height: itemHeight }]}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    margin: 2,
    backgroundColor: "#eee"
  },
  list: {
    flex: 1
  },
  columnWrapper: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: -2
  }
});
