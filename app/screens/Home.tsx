import React from 'react';
import {View, Text, Button} from 'react-native';

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to Jane's profile"
        onPress={() => navigation.navigate('Profile', {name: 'Jane'})}
      />
       <Button
        title="Go to Auth pahe"
        onPress={() => navigation.navigate('Auth')}
      />
    </View>
  );
};

export default Home;
