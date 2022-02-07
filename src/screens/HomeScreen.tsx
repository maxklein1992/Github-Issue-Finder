import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Colors, Dimensions } from "../constants";
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
  const [inputText, setInputText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [repos, setRepos] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("");
  const [isSortingVisible, setSortingVisible] = useState<boolean>(false);
  const API_URL = "https://api.github.com";

  useEffect(() => {
    search();
  }, [sort]);

  useEffect(() => {
    isSortingVisible ? null : setSort("");
  }, [isSortingVisible]);

  console.log(sort);

  const search = async () => {
    console.log("MMAXXX");
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
              ? `${API_URL}/repos/${organization}/${repoName}/issues?per_page=10&sort=${sort}&order=desc`
              : `${API_URL}/repos/${organization}/${repoName}/issues?per_page=10&order=desc`
          );
          setRepos(resultFetch);
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
          <FontAwesome5 name="github-alt" size={24} color="white" />
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
            <Button onPress={search} disabled={!inputText} title="Enter" />
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
                onPress={() =>
                  sort === "reactions" ? setSort("") : setSort("reactions")
                }
              >
                <Ionicons
                  name="thumbs-up-sharp"
                  size={18}
                  color={
                    sort === "reactions"
                      ? Colors.DEFAULT_WHITE
                      : Colors.DEFAULT_GREEN
                  }
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  sort === "reactions-eyes"
                    ? setSort("")
                    : setSort("reactions-eyes")
                }
              >
                <Octicons
                  name="eye"
                  size={18}
                  color={
                    sort === "reactions-eyes"
                      ? Colors.DEFAULT_WHITE
                      : Colors.DEFAULT_GREEN
                  }
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setSort("reactions-heart");
                }}
              >
                <Entypo
                  name="heart"
                  size={18}
                  color={
                    sort === "reactions-heart"
                      ? Colors.DEFAULT_WHITE
                      : Colors.DEFAULT_GREEN
                  }
                />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.resultsContainer}>
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            <FlatList
              data={repos.data}
              renderItem={({ item }) => (
                <SearchItem
                  id={item.id}
                  html_url={item.html_url}
                  title={item.title}
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_BLACK,
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
    color: Colors.DEFAULT_WHITE,
    marginLeft: 15,
  },
  textTile: {
    fontSize: 16,
    marginTop: 50,
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
    color: Colors.DEFAULT_WHITE,
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
    color: Colors.DEFAULT_RED,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
});

export default HomeScreen;
