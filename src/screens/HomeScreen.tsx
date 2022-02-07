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
import { FontAwesome5 } from "@expo/vector-icons";

const HomeScreen = () => {
  const textInput = useRef(null);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [repos, setRepos] = useState([]);

  const onPressContinue = async () => {
    if (inputText) {
      let result = inputText.includes("/");
      if (!result) {
        setErrorMessage(
          "Please update your search in the correct format, i.e. 'organization/repo name."
        );
      } else {
        setErrorMessage("");
        var [organization, repoName] = inputText.split("/");
        console.log(organization);
        try {
          const result = await axios(
            `https://api.github.com/repos/${organization}/${repoName}/issues?per_page=10`
          );
          setRepos(result);
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
          <TextField
            ref={textInput}
            placeholder="Vercel/vercel"
            onChangeText={(text) => setInputText(text)}
            password={false}
          />
          <Button
            onPress={onPressContinue}
            inputText={inputText}
            title="Enter"
          />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
    marginBottom: 20,
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
