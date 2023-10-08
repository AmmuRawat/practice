import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
    interpolateColor,
    runOnJS,

} from 'react-native-reanimated';
import { useState } from 'react';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';

const BUTTON_WIDTH = windowHeight * 0.55;
const BUTTON_HEIGHT = windowHeight * 0.10;
const BUTTON_PADDING = windowHeight * 0.020;
const CIRCLE_SIZE = BUTTON_HEIGHT - BUTTON_PADDING * 2;
const PLANE_ICON_SIZE = windowHeight * 0.04;

const H_WAVE_RANGE = CIRCLE_SIZE;
const H_SWIPE_RANGE = BUTTON_WIDTH - BUTTON_PADDING * 2 - CIRCLE_SIZE;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SwipeButtonProps {
    onToggle: (toggled: boolean) => void;
}

interface GestureHandlerContext {
    [key: string]: boolean;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onToggle }) => {
    const X = useSharedValue(0);
    const [toggled, setToggled] = useState(false);
    const handleComplete = (isToggled: boolean) => {
        if (isToggled !== toggled) {
            setToggled(isToggled);
            onToggle(isToggled);
        }
    };

    const animatedGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        GestureHandlerContext
    >({
        onStart: (_, ctx) => {
            ctx.completed = toggled;
        },
        onActive: (event, ctx) => {
            let newValue;
            if (ctx.completed) {
                newValue = H_SWIPE_RANGE + event.translationX;
            } else {
                newValue = event.translationX;
            }

            if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
                X.value = newValue;
            }
        },
        onEnd: () => {
            if (X.value < BUTTON_WIDTH / 2 - CIRCLE_SIZE / 2) {
                X.value = withSpring(0);
                runOnJS(handleComplete)(false);
            } else {
                X.value = withSpring(H_SWIPE_RANGE);
                runOnJS(handleComplete)(true);
            }
        },
    });

    const InterpolateXInput = [0, H_SWIPE_RANGE];
    const AnimatedStyles = {
        swipeCont: useAnimatedStyle(() => {
            return {};
        }),
        colorWave: useAnimatedStyle(() => {
            return {
                width: H_WAVE_RANGE + X.value,
                opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
            };
        }),
        swipeable: useAnimatedStyle(() => {
            return {
                backgroundColor: interpolateColor(
                    X.value,
                    [0, BUTTON_WIDTH - CIRCLE_SIZE - BUTTON_PADDING * 2],
                    ['#06d6a0', '#fff'],
                ),
                transform: [{ translateX: X.value }],
            };
        }),
        swipeText: useAnimatedStyle(() => {
            return {
                opacity: interpolate(X.value, InterpolateXInput, [0.7, 0], Extrapolate.CLAMP),
                transform: [
                    {
                        translateX: interpolate(
                            X.value,
                            InterpolateXInput,
                            [0, BUTTON_WIDTH / 2 - CIRCLE_SIZE / 2 - PLANE_ICON_SIZE / 2],
                            Extrapolate.CLAMP,
                        ),
                    },
                ],
            };
        }),
    };

    return (
        <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
            <AnimatedLinearGradient
                style={[AnimatedStyles.colorWave, styles.colorWave]}
                colors={['#06d6a0', '#1b9aaa']}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            />
            <PanGestureHandler onGestureEvent={animatedGestureHandler}>
                <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
                    {/* Replace the circle with a plane icon */}
                    <MaterialCommunityIcons
                        name="airplane"
                        size={PLANE_ICON_SIZE}
                        color="#fff"
                        style={styles.planeIcon}
                    />
                </Animated.View>
            </PanGestureHandler>
            <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>Swipe to Fly</Animated.Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    swipeCont: {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        backgroundColor: '#fff',
        borderRadius: BUTTON_HEIGHT / 2,
        padding: BUTTON_PADDING,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#1b9aaa',
    },
    colorWave: {
        position: 'absolute',
        left: 0,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT / 2,
    },
    swipeable: {
        position: 'absolute',
        left: BUTTON_PADDING,
        height: CIRCLE_SIZE,
        width: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        zIndex: 3,
    },
    planeIcon: {
        alignSelf: 'center',
        marginTop: (CIRCLE_SIZE - PLANE_ICON_SIZE) / 2,
    },
    swipeText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        zIndex: 2,
        color: '#1b9aaa',
    },
});

export default SwipeButton;
