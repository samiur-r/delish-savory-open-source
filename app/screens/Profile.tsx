import React from 'react';
import {View, Text} from 'react-native';

const Profile = ({route}) => {
  return (
    <View>
      <Text>This is {route.params.name} profile</Text>
    </View>
  );
};

export default Profile;
