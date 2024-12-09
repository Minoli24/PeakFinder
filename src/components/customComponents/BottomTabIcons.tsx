import React from 'react';
import {Icon} from 'react-native-paper';
import {colors} from '../../theme/colors';

interface BottomTabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const INACTIVE_COLOR = 'gray';
const FOCUSED_COLOR = colors.primaryGreen;

export const HomeIcon = ({color, focused, size}: BottomTabIconProps) => (
  <Icon
    source="home-outline"
    color={focused ? FOCUSED_COLOR : INACTIVE_COLOR}
    size={30}
  />
);

export const ClockIcon = ({color, focused, size}: BottomTabIconProps) => (
  <Icon
    source="clock-outline"
    color={focused ? FOCUSED_COLOR : INACTIVE_COLOR}
    size={30}
  />
);

export const AccountIcon = ({color, focused, size}: BottomTabIconProps) => (
  <Icon
    source="account-outline"
    color={focused ? FOCUSED_COLOR : INACTIVE_COLOR}
    size={30}
  />
);

export const HistoryIcon = ({color, focused, size}: BottomTabIconProps) => (
  <Icon
    source="history"
    color={focused ? FOCUSED_COLOR : INACTIVE_COLOR}
    size={30}
  />
);
