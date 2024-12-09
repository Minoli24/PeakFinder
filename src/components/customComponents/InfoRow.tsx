// InfoRow.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {Text} from './Text';

interface InfoRowProps {
  label: string;
  content: string;
}

const InfoRow: React.FC<InfoRowProps> = ({label, content}) => {
  return (
    <View style={styles.container}>
      <View style={styles.bulletPoint} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    borderRadius: 50,
    width: 7,
    height: 7,
    backgroundColor: colors.black,
    marginRight: 12,
  },
  label: {
    fontSize: 13,
    minWidth: 120,
  },
  colon: {
    fontSize: 13,

    marginLeft: 22,
  },
  content: {
    fontSize: 13,
    color: colors.grey,
    marginLeft: 8,
    flexShrink: 1,
    maxWidth: '80%',
  },
});

export default InfoRow;
