import React from 'react';
import { View, Text } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';

const VARIANT_TO_BG = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  accent: Colors.accent,
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  info: Colors.info,
  gray: Colors.gray500,
};

const SIZE_TO_PADDING = {
  sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  md: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  lg: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
};

const SIZE_TO_FONT = {
  sm: Typography.xs,
  md: Typography.sm,
  lg: Typography.base,
};

export default function Badge({
  label,
  variant = 'primary',
  size = 'sm',
  icon = null,
  style,
  textStyle,
}) {
  const backgroundColor = VARIANT_TO_BG[variant] || Colors.primary;
  const padding = SIZE_TO_PADDING[size] || SIZE_TO_PADDING.sm;
  const fontSize = SIZE_TO_FONT[size] || SIZE_TO_FONT.sm;

  return (
    <View
      style={[
        { 
          backgroundColor, 
          borderRadius: BorderRadius.full, 
          flexDirection: 'row', 
          alignItems: 'center',
        },
        padding,
        Shadows.sm,
        style,
      ]}
    >
      {icon ? (
        <Text style={{ color: Colors.textInverse, fontSize, marginRight: 6 }}>{icon}</Text>
      ) : null}
      <Text
        style={[
          { color: Colors.textInverse, fontWeight: Typography.semibold, fontSize },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}


