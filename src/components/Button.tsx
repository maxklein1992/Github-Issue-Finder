import React, { FC } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Colors } from "../constants";

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
}

const Button: FC<ButtonProps> = ({ onPress, disabled, title }) => {
  return (
    <Pressable onPress={disabled ? null : onPress}>
      <View
        style={[
          styles.btnEnter,
          {
            backgroundColor: disabled
              ? Colors.DEFAULT_GREY
              : Colors.DEFAULT_GREEN,
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
    paddingHorizontal: 15,
    paddingVertical: 15,
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
