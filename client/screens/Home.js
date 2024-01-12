import { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import axios from '../config/axios';

function HomeScreen(props) {
  const { navigation } = props;
  const [token, setToken] = useState('');

  (async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token){
        axios.defaults.headers.common.Authorization = `JWT ${token}`
        const response = await axios.get(PROFILE_URL)
      }
    } catch (error) {
      await AsyncStorage.clear()
      setToken('')
    }
  })()
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _checkToken();
    });

    return unsubscribe;
  }, [navigation]);

  const _checkToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setToken(token);
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/doc-bg.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>أهلًا بك في طبيبي</Text>
            <Text style={styles.text}>
              التطبيق الأول للربط بين الأطباء والمرضى
            </Text>
          </View>
          {token ? (
            <>
              <Button
                text="استعرض قائمة الأطباء"
                onPress={() => navigation.navigate('Doctors')}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.labelButton}>استعراض الملف الشخصي</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Button
                text="تسجيل الدخول"
                onPress={() => navigation.navigate('SignIn')}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.labelButton}>إنشاء حساب جديد</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ImageBackground>
    </>
  );
}

const textStyles = {
  color: '#fff',
  textAlign: 'center',
  fontFamily: 'NotoFont',
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    ...textStyles,
    fontSize: 35,
  },
  text: {
    ...textStyles,
    fontSize: 20,
  },
  labelButton: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default HomeScreen