import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import type { IconName } from '../../constants/glossary';
import { colors } from '../../constants/theme';

export function Icon({ name, color, size = 24 }: { name: IconName; color: string; size?: number }) {
  return (
    <MaterialIcons
      name={name}
      size={size}
      color={color}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      aria-hidden
    />
  );
}

export function IconBubble({
  name,
  color = colors.primary,
  bg = colors.tint,
  size = 22,
}: {
  name: IconName;
  color?: string;
  bg?: string;
  size?: number;
}) {
  const box = size + 18;
  return (
    <View
      style={{
        width: box,
        height: box,
        borderRadius: box / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={name} color={color} size={size} />
    </View>
  );
}
