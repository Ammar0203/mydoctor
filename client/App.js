import 'react-native-gesture-handler'
import './config/urls'
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import HomeScreen from './screens/Home';
import SignUpScreen from './screens/SignUp';
import SignInScreen from './screens/SignIn';
import ProfileScreen from './screens/Profile';
import DoctorsScreen from './screens/Doctors';

const Stack = createNativeStackNavigator()

export default function App() {
  const [loaded] = useFonts({
    NotoFont: require('./assets/fonts/NotoKufiArabic-Regular.ttf')
  })

  if(!loaded) return null

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'NotoFont'
          },
          headerTitleAlign: 'center'
        }}
      >
        <Stack.Screen 
          name='Home'
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name='Doctors'
          component={DoctorsScreen}
          options={{
            title: 'الاطباء'
          }}
        />
        <Stack.Screen 
          name='SignUp'
          component={SignUpScreen}
          options={{
            title: 'حساب جديد'
          }}
        />
        <Stack.Screen 
          name='SignIn'
          component={SignInScreen}
          options={{
            title: 'تسجيل الدخول'
          }}
        />
        <Stack.Screen 
          name='Profile'
          component={ProfileScreen}
          options={{
            title: 'الملف الشخصي'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
