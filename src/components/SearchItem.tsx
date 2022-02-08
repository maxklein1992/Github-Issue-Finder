import React, { FC } from "react";
import { Pressable, Text, StyleSheet, View, Linking } from "react-native";
import { Constants } from "../general";
import { EvilIcons } from "@expo/vector-icons";

interface SearchItemProps {
  id: string | null;
  htmlUrl: string | null;
  title: string | null;
}

const SearchItem: FC<SearchItemProps> = ({ id, htmlUrl, title }) => {
  return (
    <View style={styles.resultsItemContainer}>
      <View style={styles.resultsItemHeader}>
        <Text style={styles.resultsItemId}>{`ID: #${id}`}</Text>
        <Pressable onPress={() => Linking.openURL(htmlUrl)}>
          <EvilIcons
            name="search"
            size={18}
            color={Constants.Colors.DEFAULT_WHITE}
          />
        </Pressable>
      </View>

      <Text style={styles.resultsItemTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  resultsItemContainer: {
    marginBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: Constants.Colors.DEFAULT_GREEN,
    paddingBottom: 10,
    width: "100%",
  },
  resultsItemHeader: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultsItemId: {
    color: Constants.Colors.DEFAULT_WHITE,
    fontSize: 10,
    fontFamily: "Poppins_700Bold",
  },
  resultsItemTitle: {
    color: Constants.Colors.DEFAULT_GREEN,
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
  },
});

export default SearchItem;
