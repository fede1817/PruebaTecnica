import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Animated,
  Easing,
} from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
  backgroundColor?: string;
  usePulseAnimation?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3498db',
  text,
  fullScreen = false,
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  usePulseAnimation = false,
}) => {
  const [pulseAnim] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    if (usePulseAnimation) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [usePulseAnimation]);

  const spinner = (
    <Animated.View
      style={usePulseAnimation ? {transform: [{scale: pulseAnim}]} : {}}>
      <ActivityIndicator size={size} color={color} />
    </Animated.View>
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenContainer, {backgroundColor}]}>
        <View style={styles.fullScreenContent}>
          {spinner}
          {text && <Text style={[styles.text, {color}]}>{text}</Text>}
        </View>
      </View>
    );
  }

  if (text) {
    return (
      <View style={styles.containerWithText}>
        {spinner}
        <Text style={[styles.text, {color}]}>{text}</Text>
      </View>
    );
  }

  return <View style={styles.container}>{spinner}</View>;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullScreenContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWithText: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingSpinner;
