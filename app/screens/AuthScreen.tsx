// AuthScreen.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleAuth = () => {
    if (isLogin) {
      // Handle login logic here
      console.log(`Login with email: ${email} and password: ${password}`);
    } else {
      // Handle registration logic here
      console.log(
        `Register with name: ${name}, email: ${email}, and password: ${password}`,
      );
    }
  };

  return (
    <View>
      <Text>{isLogin ? 'Login' : 'Register'}</Text>
      {!isLogin && (
        <TextInput
          placeholder="Name"
          onChangeText={text => setName(text)}
          value={name}
        />
      )}
      <TextInput
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title={isLogin ? 'Login' : 'Register'} onPress={handleAuth} />
      <Button
        title={isLogin ? 'Switch to Register' : 'Switch to Login'}
        onPress={toggleForm}
      />
    </View>
  );
};

export default AuthScreen;
