import React, { FC } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Colors } from "../constants";

interface ButtonProps {
  onPress: () => void;
  inputText: string | null;
  title: string | null;
}

const Button: FC<ButtonProps> = ({ onPress, inputText, title }) => {
  return (
    <Pressable onPress={inputText ? onPress : null}>
      <View
        style={[
          styles.btnEnter,
          {
            backgroundColor: inputText
              ? Colors.DEFAULT_GREEN
              : Colors.DEFAULT_GREY,
          },
        ]}
      >
        <Text style={styles.textEnter}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnEnter: {
    width: 100,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#244DB7",
  },
  textEnter: {
    color: Colors.DEFAULT_WHITE,
    alignItems: "center",
    fontFamily: "Poppins_700Bold",
  },
});

export default Button;
