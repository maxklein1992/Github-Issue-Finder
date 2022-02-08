import React from "react";
import { TextInput, TextInputProps, StyleSheet, View } from "react-native";
import { Constants, Dimensions } from "../general";

interface TextFieldProps extends TextInputProps {
  password?: boolean;
  ref?: React.Ref<TextInput>;
}

const TextField: React.FC<TextFieldProps> = React.forwardRef<
  TextInput,
  TextFieldProps
>((props, ref) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        secureTextEntry={props.password}
        ref={ref}
        style={styles.textInput}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "white",
    borderBottomWidth: 5,
    borderBottomColor: Constants.Colors.DEFAULT_GREEN,
    width: Dimensions.setWidth(60),
    height: 50,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins_400Regular",
  },
});

export default TextField;
