import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Colors, Dimensions, Constants } from "../general";
import axios from "axios";
import { Button, TextField, SearchItem } from "../components";
import {
  Ionicons,
  FontAwesome5,
  Octicons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";

const HomeScreen = () => {
  const textInput = useRef(null);
  const flatListRef = useRef();
  const [inputText, setInputText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [pages, setPages] = useState<number>(10);
  const [repos, setRepos] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("");
  const [isSortingVisible, setSortingVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  console.log(pages);

  useEffect(() => {
    isSortingVisible ? null : setSort("");
  }, [isSortingVisible]);

  useEffect(() => {
    searchHandler();
  }, [sort]);

  console.log(sort);

  const handleLoadMore = () => {
    setPages(pages + 10);
    searchHandler();
  };

  const searchHandler = async () => {
    setLoading(true);
    if (inputText) {
      let resultInputText = inputText.includes("/");
      if (!resultInputText) {
        setErrorMessage(
          "Please update your search in the correct format, i.e. 'organization/repo name."
        );
      } else {
        setErrorMessage("");
        var [organization, repoName] = inputText.split("/");
        try {
          const resultFetch = await axios(
            sort
              ? `${Constants.GITHUB_API_URL}/repos/${organization}/${repoName}/issues?per_page=${pages}&sort=${sort}&order=desc`
              : `${Constants.GITHUB_API_URL}/repos/${organization}/${repoName}/issues?per_page=${pages}&order=desc`
          );
          setRepos(resultFetch);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setErrorMessage("There are no results. Please try again.");
        }
      }
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
              ref={textInput}
              placeholder="Vercel/vercel"
              onChangeText={(text) => setInputText(text)}
              password={false}
            />
            <Button
              onPress={() => searchHandler()}
              disabled={!inputText}
              title="Enter"
            />
          </View>
          <View style={styles.advancedSearchContainer}>
            <Button
              onPress={
                isSortingVisible
                  ? () => setSortingVisible(false)
                  : () => setSortingVisible(true)
              }
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
            data={repos.data}
            renderItem={({ item }) => (
              <SearchItem
                id={item.id}
                html_url={item.html_url}
                title={item.title}
              />
            )}
            refreshing={isLoading}
            ListEmptyComponent={
              errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : isLoading && repos.data ? (
                <ActivityIndicator
                  size={20}
                  color={Constants.Colors.DEFAULT_GREEN}
                />
              ) : null
            }
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
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
