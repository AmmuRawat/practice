import React, { useRef, useState, useCallback } from 'react';
import MapComponent from '../Components/MissionMaps'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {
    StyleSheet, View, DrawerLayoutAndroid, TouchableWithoutFeedback, Text, TouchableOpacity, Dimensions, Modal, Animated, Image, NativeModules, Alert
} from 'react-native';
import CameraComponent from '../Components/Camera'
const { MavlinkCommand } = NativeModules;
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
import LeftSidebar from '../Components/LeftSidebar'

interface ExtendedMapComponent {
    zoomIn: () => void;
    zoomOut: () => void;
    centerOnHome: () => void;
    setMapType: (type: string) => void;
}

const Guide = () => {
    const mapRef = useRef<ExtendedMapComponent>(null);
    const iconSize = windowHeight * 0.05;
    const iconSizezoom = windowHeight * 0.06;
    const HomeiconSize = windowHeight * 0.04;
    const [mapType, setMapType] = useState<'Street' | 'Light' | 'Dark' | 'SatelliteStreet'>('SatelliteStreet');
    const drawerRef = useRef<DrawerLayoutAndroid>(null);
    const [viewMode, setViewMode] = useState(true);


    const mapViewTypes = ['Street', 'Light', 'Dark', 'SatelliteStreet'];

    const handleMapTypeToggle = () => {
        const currentMapTypeIndex = mapViewTypes.indexOf(mapType);
        const newMapTypeIndex = (currentMapTypeIndex + 1) % mapViewTypes.length;
        const newMapType = mapViewTypes[newMapTypeIndex] as 'Street' | 'Light' | 'Dark' | 'SatelliteStreet';

        setMapType(newMapType);
        mapRef.current?.setMapType(newMapType);
    };

    const openDrawer = useCallback(() => {
        drawerRef.current?.openDrawer();
    }, []);
    const handleHomeClick = () => {
        // Call the function exposed by the child component
        mapRef.current?.centerOnHome();
        // console.log('ddddddddddddd')
    };
    const closeDrawer = useCallback(() => {
        drawerRef.current?.closeDrawer();
    }, []);
    const [isCameraSmall, setIsCameraSmall] = useState(true);
    const handleCameraToggle = () => {
        // Toggle the isCameraSmall state
        setIsCameraSmall(prev => !prev);
        setViewMode(!viewMode)
        // Call setViewMode if you have any other logic associated with it
        // setViewMode(...);
    };
    return (
        <DrawerLayoutAndroid
            ref={drawerRef}
            drawerWidth={windowWidth * 0.25}
            drawerPosition={'left'}
            renderNavigationView={() => <LeftSidebar />}
            onDrawerOpen={openDrawer}
            onDrawerClose={closeDrawer}>
            <View style={styles.mapContainer}>
                <View style={styles.absoluteContainer}>

                    {/* ////////////normal back with back button //////////*/}

                    {/* <View style={viewMode ? styles.fullSize : styles.mapSmall}>
                        <MapComponent ref={mapRef} mapType={mapType} />
                    </View> */}

                    {/* ////////////switching between map to camera to map with a single click //////////*/}

                    {!viewMode && (
                        <TouchableWithoutFeedback onPress={handleCameraToggle}>
                            <View style={styles.mapSmall}>
                                <MapComponent ref={mapRef} mapType={mapType} allowMarkers={false} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}

                    { /* Large Map */}
                    {viewMode && (
                        <View style={styles.fullSize}>
                            <MapComponent ref={mapRef} mapType={mapType} allowMarkers={true} />
                        </View>
                    )}
                    {/* ////////////switching between map to camera to map with a single click //////////*/}

                    {/* <TouchableOpacity onPress={handleCameraToggle} >
                        <View style={viewMode ? styles.cameraPreviewSmall : styles.cameraPreview} pointerEvents={isCameraSmall ? 'auto' : 'none'}>
                            <CameraComponent isCameraSmall={isCameraSmall} />
                            {viewMode && (
                                <View style={styles.waitingContainer}>
                                    <Text style={styles.waitingText}>Waiting for video</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity> */}
                    {/* <View style={[styles.cameraButtonsContainer, { top: windowHeight * 0.17 }]}>
                        <TouchableOpacity style={styles.cameraButton} onPress={() => { }}>
                            <MaterialIcons name="camera-alt" size={iconSize} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cameraButton} onPress={() => { }}>
                            <MaterialIcons name="videocam" size={iconSize} color="#fff" />
                        </TouchableOpacity>

                    </View> */}

                    <View style={styles.bottomButtonsContainer}>
                        <View>
                            <TouchableOpacity style={styles.cameraButton} onPress={() => {
                                Alert.alert(
                                    "Return To Home (RTL) Confirmation",
                                    "Are you sure you want to initiate Return To Home (RTL)?",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "Yes",
                                            onPress: () => {
                                                console.log("RTL initiated");
                                                MavlinkCommand.sendRtlMessage();
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }}>
                                <Fontisto name="arrow-return-left" size={iconSize} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cameraButton} onPress={() => { MavlinkCommand.sendLandMessage() }}>
                                <MaterialIcons name="flight-land" size={iconSize} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cameraButton}
                                onPress={() => {
                                    Alert.alert(
                                        "Take Off Confirmation",
                                        "Are you sure you want to take off?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    MavlinkCommand.sendTakeoffMessage();
                                                }
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                }}
                            >
                                <MaterialIcons name="flight-takeoff" size={iconSize} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cameraButton} onPress={() => { MavlinkCommand.sendArmMessage() }}>
                                <MaterialIcons name="lock" size={iconSize} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.zoomButtonsContainer, {}]}>

                        <TouchableOpacity style={styles.zoomButton} onPress={handleMapTypeToggle}>
                            <MaterialIcons name="layers" size={iconSizezoom} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={() => {
                                // console.log('Home button clicked');
                                handleHomeClick();
                            }}
                        >
                            <MaterialIcons name="home" size={HomeiconSize} color="#fff" />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
    absoluteContainer: {
        ...StyleSheet.absoluteFillObject,
    }, fullSize: {
        width: '100%',
        height: '100%',
    }, waitingContainer: {
        position: 'absolute',
        top: 0,
        borderRadius: 20,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    waitingText: {
        color: 'white',
        fontSize: 16,
    },
    cameraPreview: {
        width: '100%',
        height: '100%',
        // zIndex: 1,   
        marginTop: 180,
        position: 'absolute',
    },
    cameraPreviewSmall: {
        position: 'absolute',
        bottom: 10,
        borderRadius: 20,
        right: 10,
        // height: 100,
        // width: 100,
        zIndex: 100,
        backgroundColor: '#000000'
    },
    map: {
        flex: 1,
    },
    mapSmall: {
        position: 'absolute',
        bottom: windowHeight * 0.01,
        right: windowHeight * 0.01,
        height: windowHeight * 0.30,
        width: windowHeight * 0.44,
        borderRadius: 5,
    },
    cameraButtonsContainer: {
        position: 'absolute',
        marginBottom: 5,
        left: windowHeight * 0.02,
        // top: 180,

    }, bottomButtonsContainer: {
        position: 'absolute',
        left: windowHeight * 0.02,
        bottom: windowHeight * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: windowHeight * 0.01,
        borderRadius: windowHeight * 0.012,
        borderWidth: windowHeight * 0.003,
        borderColor: '#000',
        marginBottom: 5,
    },
    mapContainer: {
        flex: 1,
    },

    zoomButtonsContainer: {
        position: 'absolute',
        right: windowHeight * 0.02,
        bottom: windowHeight * 0.02
    },
    zoomButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: windowHeight * 0.003,
        marginBottom: 5,
    }

});
export default Guide;
