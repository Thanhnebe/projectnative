import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import SignUpScreen from './Screens/SignUpScreen';
import ChapterDetailScreen from './Screens/ChapterDetailScreen';
import MyWalletScreen from './Screens/MyWalletScreen';
import ProfileScreen from './Screens/ProfileScreen';
import TopicDetailScreen from './Screens/TopicDetailScreen';
import ProblemDetailScreen from './Screens/ProblemDetailScreen';
import CourseManagementScreen from './Screens/CourseManagementScreen';
import OTPScreen from './Screens/OTPScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyWallet" component={MyWalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="CourseManagement" component={CourseManagementScreen} />

    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
        <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
        <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
