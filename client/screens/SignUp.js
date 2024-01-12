import { ScrollView, KeyboardAvoidingView, View } from 'react-native'
import { useEffect, useState } from 'react';
import axios from '../config/axios'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import styles from './styles/authStyles'
import ScreenTitle from '../components/ScreenTitle'
import Input from '../components/Input'
import Button from '../components/Button'
import Loader from '../components/Loader'
import Alert from '../components/Alert'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

function SignUpScreen(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    phone: '',
    address: '',
    workingHours: '',
    userType: false,
    location: null,
  });
  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ messages: null, type: '' });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({messages: null, type: ''})
    }, 4000)

    return () => clearTimeout(timer)
  }, [alert])

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const changeFormValue = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const {
    name,
    email,
    password,
    specialization,
    address,
    phone,
    workingHours,
    userType,
  } = formData;

  const validate = () => {
    const {
      name,
      email,
      password,
      userType,
      specialization,
      address,
      phone,
      workingHours,
    } = formData;
    let validationErrors = [];
    let passed = true;

    if (!name) {
      validationErrors.push('الرجاء إدخال اسم المستخدم');
      passed = false;
    }

    if (!email) {
      validationErrors.push('الرجاء إدخال البريد الإلكتروني');
      passed = false;
    }

    if (!password) {
      validationErrors.push('الرجاء إدخال كلمة المرور');
      passed = false;
    }

    if (userType) {

      if (!specialization) {
        validationErrors.push('الرجاء إدخال التخصص ');
        passed = false;
      }

      if (!address) {
        validationErrors.push('الرجاء إدخال العنوان');
        passed = false;
      }

      if (!workingHours) {
        validationErrors.push('الرجاء إدخال ساعات العمل');
        passed = false;
      }

      if (!phone) {
        validationErrors.push('الرجاء إدخال رقم الهاتف');
        passed = false;
      }
    }

    if (validationErrors.length > 0) {
      setAlert({ messages: validationErrors, type: 'danger' });
    }
    return passed;
  };

  const _signUp = () => {
    if (!validate()) return
    (async () => {
      setLoading(true)
      const body = {
        name,
        email,
        password,
        userType: userType ? 'doctor' : 'normal',
        specialization,
        address,
        phone,
        workingHours,
        location: {
          latitude: location ? location.coords.latitude : null,
          longitude: location ? location.coords.longitude : null,
        }
      }
      
      try {
        const response = await axios.post(SIGNUP_URL, body)

        setFormData({
          name: '',
          email: '',
          password: '',
          specialization: '',
          address: '',
          phone: '',
          workingHours: '',
          location: null,
          userType: false,
        });
        await AsyncStorage.setItem('accessToken', response.data.accessToken)
        
        props.navigation.navigate('Home')
        setLoading(false)
      } catch (error) {
        let err = error?.response?.data?.message 
        if (!err) err = error?.response?.data?.errors[0]?.message
        setAlert({messages: (err == 'email must be unique' ? 'الايميل مستخدم' : err), type: 'danger'})
        setLoading(false)
      }

    })()
  }
  return (
    <ScrollView contentContainerStyle={{paddingVertical: 20}} >
      <Loader title='جاري انشاء الحساب الجديد' loading={isLoading} />
      <Alert messages={alert.messages} type={alert.type} />
      <View style={styles.container}>
        <ScreenTitle title='انشاء حساب جديد' icon='md-person-add' />
        <KeyboardAvoidingView behavior='padding' enabled>
          <Input placeholder='الاسم' onChangeText={(text) => changeFormValue('name', text)} value={name} />
          <Input placeholder='البريد الاكتروني' onChangeText={(text) => changeFormValue('email', text)} value={email} />
          <Input secureTextEntry placeholder='كلمة المرور' onChangeText={(text) => changeFormValue('password', text)} value={password} />
          <BouncyCheckbox 
            text='طبيب'
            textStyle={{
              color: 'black',
              fontSize: 18,
              fontWeight: 600,
              textDecorationLine: 'none'
            }}
            style= {{
              justifyContent: 'flex-end',
              marginBottom: 16
            }}
            innerIconStyle={{
              borderRadius: 5,
            }}
            iconStyle={{
              borderRadius: 5,
            }}
            fillColor='#007bff'
            unfillColor='white'
            onPress={(isChecked) => changeFormValue('userType', isChecked)}
            isChecked={userType}
          />
          {userType && (
            <>
              <Input placeholder='التخصص' onChangeText={(text) => changeFormValue('specialization', text)} value={specialization} />
              <Input placeholder='ساعات العمل' onChangeText={(text) => changeFormValue('workingHours', text)} value={workingHours} />
              <Input placeholder='العنوان' onChangeText={(text) => changeFormValue('address', text)} value={address} />
              <Input placeholder='الهاتف' onChangeText={(text) => changeFormValue('phone', text)} value={phone} />
            </>
          )}
          <Button text='انشاء' onPress={_signUp}/>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  )
}

export default SignUpScreen