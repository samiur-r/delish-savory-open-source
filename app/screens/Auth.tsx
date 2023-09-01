import React from 'react';
import {View, Text, Button} from 'react-native';

const Auth = ({navigation}) => {
  return (
    <View>
      <Text>Auth</Text>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default Auth;
