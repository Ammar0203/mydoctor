import { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axios';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import ScreenTitle from '../components/ScreenTitle';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import styles from './styles/authStyles';

function SignInScreen(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ messages: null, type: ''})

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({messages: null, type: ''})
    }, 4000);

    return () => clearTimeout(timer)
  }, [alert])

  const changeEmailHandler = (value) => {
    setEmail(value)
  }
  const changePasswordHandler = (value) => {
    setPassword(value)
  }

  const validate = () => {
    let validationErrors = [];
    let passed = true;
    
    if (!email) {
      validationErrors.push('الرجاء إدخال البريد الإلكتروني');
      passed = false;
    }

    if (!password) {
      validationErrors.push('الرجاء إدخال كلمة المرور');
      passed = false;
    }

    if (validationErrors.length > 0) {
      setAlert({ messages: validationErrors, type: 'danger' });
    }
    return passed;
  };

  const _signIn = () => {
    (async() => {
      if (!validate()) return 
      setLoading(true)

      try {
        const response = await axios.post(SIGNIN_URL, {email, password})
        setEmail('')
        setPassword('')
        await AsyncStorage.setItem('accessToken', response.data.accessToken)
        props.navigation.navigate('Home')
        setLoading(false)
      } catch (error) {
        let err = error?.response?.data?.message
        setAlert({messages: (err), type: 'danger'})
        setLoading(false)
      }
    })()
  }

  return (
    <Container>
      <Alert messages={alert.messages} type={alert.type} />
      <Loader title="تسجيل الدخول" loading={isLoading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <ScreenTitle title="تسجيل الدخول" icon="md-log-in" />
        <KeyboardAvoidingView behavior="padding" enabled>
          <Input
            onChangeText={changeEmailHandler}
            value={email}
            placeholder="البريد الإلكتروني"
          />
          <Input
            onChangeText={changePasswordHandler}
            value={password}
            secureTextEntry
            placeholder="كلمة المرور"
          />
        </KeyboardAvoidingView>

        <Button text="دخول" onPress={_signIn} />
      </ScrollView>
    </Container>
  );
}

export default SignInScreen;
