import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Dimensions, Constants } from "../general";
//import axios from "axios";
import { Button, TextField, SearchItem } from "../components";
import { Ionicons, FontAwesome5, Octicons, Entypo } from "@expo/vector-icons";
import { Repo } from "../types";
import axios from "axios";

const HomeScreen = () => {
  const flatListRef = useRef();
  const [inputText, setInputText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [sort, setSort] = useState<string>("");
  const [isSortingVisible, setSortingVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  console.log(repos);

  useEffect(() => {
    !isSortingVisible && setSort("");
  }, [isSortingVisible]);

  useEffect(() => {
    searchHandler(0);
  }, [sort]);

  const updatePageIndex = (index: number) => {
    setPageIndex(index);
  };

  const searchHandler = async (index: number) => {
    if (!inputText) {
      return;
    }
    setLoading(true);
    setRepos([]);
    const resultInputText = inputText.includes("/");
    if (!resultInputText) {
      setErrorMessage(
        "Please update your search in the correct format, i.e. 'organization/repo name."
      );
      return;
    }
    const [organization, repoName] = inputText.split("/");
    try {
      const resultFetch = await axios(
        sort
          ? `${Constants.GITHUB_API_URL}/repos/${organization}/${repoName}/issues?per_page=${Constants.ITEMS_PER_PAGE}&page=${index}&sort=${sort}&order=desc`
          : `${Constants.GITHUB_API_URL}/repos/${organization}/${repoName}/issues?per_page=${Constants.ITEMS_PER_PAGE}&page=${index}&order=desc`
      );
      setErrorMessage("");
      setRepos(resultFetch.data);
      setLoading(false);
      updatePageIndex(index);
    } catch (err) {
      setErrorMessage("There are no results. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <FontAwesome5
            name="github-alt"
            size={24}
            color={Constants.Colors.DEFAULT_WHITE}
          />
          <Text style={styles.headerTitle}>Github Issue Finder App</Text>
        </View>
        <Text style={styles.textTile}>
          Please enter the Organization and Repo name and press on "Enter".
        </Text>
        <View style={styles.searchContainer}>
          <View style={styles.basicSearchContainer}>
            <TextField
              placeholder="Vercel/vercel"
              onChangeText={(text) => setInputText(text)}
              password={false}
            />
            <Button
              onPress={() => searchHandler(0)}
              disabled={!inputText}
              title="Enter"
            />
          </View>
          <View style={styles.advancedSearchContainer}>
            <Button
              onPress={() => setSortingVisible(!isSortingVisible)}
              title={isSortingVisible ? "Hide and clear" : "Sort by"}
            />
            <View
              style={[
                styles.sortIconsContainer,
                { display: isSortingVisible ? "flex" : "none" },
              ]}
            >
              <Pressable
                onPress={() => {
                  sort === "reactions" ? setSort("") : setSort("reactions");
                }}
              >
                <Ionicons
                  name="thumbs-up-sharp"
                  size={18}
                  color={
                    sort === "reactions"
                      ? Constants.Colors.DEFAULT_WHITE
                      : Constants.Colors.DEFAULT_GREEN
                  }
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  sort === "reactions-eyes"
                    ? setSort("")
                    : setSort("reactions-eyes");
                }}
              >
                <Octicons
                  name="eye"
                  size={18}
                  color={
                    sort === "reactions-eyes"
                      ? Constants.Colors.DEFAULT_WHITE
                      : Constants.Colors.DEFAULT_GREEN
                  }
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  sort === "reactions-heart"
                    ? setSort("")
                    : setSort("reactions-heart");
                }}
              >
                <Entypo
                  name="heart"
                  size={18}
                  color={
                    sort === "reactions-heart"
                      ? Constants.Colors.DEFAULT_WHITE
                      : Constants.Colors.DEFAULT_GREEN
                  }
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.resultsContainer}>
          <FlatList
            ref={flatListRef}
            data={repos}
            renderItem={({ item }) => (
              <SearchItem
                id={item.id}
                htmlUrl={item.htmlUrl}
                title={item.title}
              />
            )}
            refreshing={isLoading}
            ListEmptyComponent={
              isLoading ? (
                <ActivityIndicator
                  size={30}
                  color={Constants.Colors.DEFAULT_WHITE}
                />
              ) : errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null
            }
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            onEndReachedThreshold={0}
            onEndReached={() => searchHandler(pageIndex + 1)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Constants.Colors.DEFAULT_BLACK,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
    width: Dimensions.setWidth(90),
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: Constants.Colors.DEFAULT_WHITE,
    marginLeft: 15,
  },
  textTile: {
    fontSize: 16,
    marginTop: 50,
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
    color: Constants.Colors.DEFAULT_WHITE,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  basicSearchContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  advancedSearchContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sortIconsContainer: {
    flex: 0.75,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 30,
  },
  resultsContainer: {
    flexDirection: "row",
    height: 300,
  },
  errorMessage: {
    color: Constants.Colors.DEFAULT_RED,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
});

export default HomeScreen;
