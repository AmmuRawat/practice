// import React, { useState } from 'react';
// import { VLCPlayer } from 'react-native-vlc-media-player';
// import { View, StyleSheet, Button } from 'react-native';

// interface CameraProps {
//     isCameraSmall: boolean;
// }

// function Camera({ isCameraSmall }: CameraProps) {
//     const [zoomLevel, setZoomLevel] = useState(1);  // initial zoom level is 1 (no zoom)
//     const containerStyle = isCameraSmall ? styles.containerSmall : styles.containerLarge;
//     const playerStyle = isCameraSmall ? styles.playerSmall : styles.playerLarge;
//     let value = 0;
//     const handleZoomIn = () => {
//         setZoomLevel(prevZoomLevel => prevZoomLevel * 1.2);  // increase zoom level by 20%
//     };

//     const handleZoomOut = () => {
//         setZoomLevel(prevZoomLevel => prevZoomLevel / 1.2);  // decrease zoom level by 20%
//     };
//     return (
//         <View style={containerStyle}>
//             <VLCPlayer
//                 autoplay={true}
//                 autoAspectRatio={true}
//                 style={[
//                     playerStyle,
//                     { transform: [{ scaleX: -1 }, { scale: zoomLevel }] }  // update transform property
//                 ]} source={{
//                     initType: 2,
//                     hwDecoderEnabled: 0,
//                     hwDecoderForced: 0,
//                     uri: 'rtsp://192.168.153.66:8554/test',
//                     // uri: 'rtsp://192.168.153.235:8554/test', //one plus 8
//                     initOptions: [
//                         "--rtsp-tcp",
//                         "--network-caching=0",
//                         "--rtsp-caching=0",
//                         "--no-stats",
//                         "--tcp-caching=0",
//                         "--realrtsp-caching=0",
//                     ],
//                 }}
//                 isLive={true}
//                 autoReloadLive={true}
//                 onPlaying={(e) => {
//                     console.log("aaa", e);
//                 }}
//             />
//             <View style={styles.zoomButtonsContainer}>
//                 <Button title="Zoom In" onPress={handleZoomIn} />
//                 <Button title="Zoom Out" onPress={handleZoomOut} />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     zoomButtonsContainer: {
//         flexDirection: 'row',
//         marginBottom: 70,
//     },
//     containerLarge: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//         width: '110%',
//         // marginTop: 60

//     },
//     containerSmall: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 20,
//         overflow: 'hidden',
//         backgroundColor: 'black'
//     },
//     playerLarge: {
//         height: 380,
//         width: 520,
//         transform: [{ scaleX: -1 }]
//     },
//     playerSmall: {
//         height: 120,
//         width: 170,
//         transform: [{ scaleX: -1 }]
//     },
// });

// export default Camera;

import React, { useState } from 'react';
import { VLCPlayer } from 'react-native-vlc-media-player';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

interface CameraProps {
    isCameraSmall: boolean;
    onCameraConnectedChange: (connected: boolean) => void;
}
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

function Camera({ isCameraSmall, onCameraConnectedChange }: CameraProps) {
    // console.log('Camera component is being rendered.');
    const [isCameraConnected, setIsCameraConnected] = useState(false);
    const containerStyle = isCameraSmall ? styles.containerSmall : styles.containerLarge;
    const playerStyle = isCameraSmall ? styles.playerSmall : styles.playerLarge;
    return (
        <View style={containerStyle}>
            <VLCPlayer
                autoplay={true}
                key={isCameraConnected ? "connected" : "disconnected"}
                autoAspectRatio={true}
                style={playerStyle}
                source={{
                    initType: 2,
                    hwDecoderEnabled: 0,
                    hwDecoderForced: 0,
                    // uri: 'rtsp://192.168.202.71:8554/wfb',
                    uri: 'rtsp://192.168.54.28:8554/test', //one plus 8
                    initOptions: [
                        "--rtsp-tcp",
                        "--network-caching=0",
                        "--rtsp-caching=0",
                        "--no-stats",
                        "--tcp-caching=0",
                        "--realrtsp-caching=0",
                    ],
                }}
                isLive={true}
                autoReloadLive={true}
                onPlaying={(e) => {
                    // console.log("onPlaying event triggered");
                    setIsCameraConnected(true);
                    onCameraConnectedChange(true);
                }}
                onStopped={(e) => {
                    // console.log('VLCPlayer onStopped event triggered');
                    setIsCameraConnected(false);
                    onCameraConnectedChange(false);
                }}
                onEnded={() => {
                    // console.log('VLCPlayer onEnded event triggered');
                    setIsCameraConnected(false);
                }} onError={(e) => {
                    // console.log('VLCPlayer onError event triggered', e);
                    setIsCameraConnected(false);
                }}
            // onPaused={() => console.log('VLCPlayer onPaused event triggered')}
            />
            {!isCameraConnected && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>Waiting for video</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    overlayText: {
        color: 'white',
        fontSize: 20
    },
    containerLarge: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        width: '100%',
        // marginTop: 60

    },
    containerSmall: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'black'
    },
    playerLarge: {
        height: windowHeight * 1.1,
        width: windowHeight * 1.5,
        transform: [{ scaleX: -1 }]
    },
    playerSmall: {
        height: windowHeight * 0.3,
        width: windowHeight * 0.4,
        transform: [{ scaleX: -1 }]
    },
});

export default Camera;

