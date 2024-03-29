import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default (props) => {
  const [focused, setFocused] = useState(false);
  const {
    onChangeText,
    inputStyles,
    value,
    placeholder,
    secureTextEntry,
    icon,
  } = props;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, inputStyles, focused && styles.focused]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor='#999999'
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {icon && (
        <Ionicons name={icon} size={30} color="#ccc" style={styles.icon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    width: 300,
    fontSize: 18,
    fontWeight: '600',
    padding: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  focused: {
    borderBottomColor: '#007bff',
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
});
