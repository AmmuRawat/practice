// import React from 'react';
// import { StyleSheet, Dimensions } from 'react-native';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

// const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// const DraggableCamera = ({ isCameraSmall, children }) => {
//     if (!isCameraSmall) {
//         // If the camera isn't small, just return the children
//         return children;
//     }

//     const translateX = useSharedValue(0);
//     const translateY = useSharedValue(0);

//     const gestureHandler = useAnimatedGestureHandler({
//         onStart: (_, ctx) => {
//             ctx.startX = translateX.value;
//             ctx.startY = translateY.value;
//         },
//         onActive: (event, ctx) => {
//             let nextX = ctx.startX + event.translationX;
//             let nextY = ctx.startY + event.translationY;

//             // Constrain X and Y to the dimensions of the screen
//             translateX.value = Math.max(0, Math.min(windowWidth - 100, nextX));  // Assuming a width of 100 for the draggable item
//             translateY.value = Math.max(0, Math.min(windowHeight - 100, nextY));  // Assuming a height of 100 for the draggable item
//         },
//         // Removed onEnd so it stays where you leave it
//     });

//     const animatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [
//                 { translateX: translateX.value },
//                 { translateY: translateY.value },
//             ],
//         };
//     });

//     return (
//         <PanGestureHandler onGestureEvent={gestureHandler}>
//             <Animated.View style={[styles.draggable, animatedStyle]}>
//                 {children}
//             </Animated.View>
//         </PanGestureHandler>
//     );
// };

// const styles = StyleSheet.create({
//     draggable: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         zIndex: 1,
//     },
// });

// export default DraggableCamera;
