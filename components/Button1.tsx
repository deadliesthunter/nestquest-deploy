import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const Button1 = ({ title, onPress, classname, textclassname }) => {
  return (
    <TouchableOpacity
      className={classname}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text className={textclassname}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button1;
