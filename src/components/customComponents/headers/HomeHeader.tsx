import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {Avatar, Icon} from 'react-native-paper';
import {Text} from '../Text';
import {colors} from '../../../theme/colors';
import {useMMKVString} from 'react-native-mmkv';
import useNavigationStateStore from '../../../store/navigationStore';

export default function HomeHeader() {
  const {userName} = useNavigationStateStore();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
        }}>
        <Avatar.Text
          label={userName?.slice(0, 2)}
          size={37}
          labelStyle={{
            alignItems: 'center',
            textAlign: 'center',
            fontSize: 15,
          }}
        />
        <View>
          <Text variant="regular" fontSize={12}>
            Welcome back,
          </Text>
          <Text variant="bold" fontSize={12}>
            {userName}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          backgroundColor: colors.white,
          borderRadius: 38,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon source="bell-outline" color={colors.primaryGreen} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
