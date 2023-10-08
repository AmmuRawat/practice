import React, { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Guide from '../Pages/GuidedControl';
import Mission from '../Pages/MissionControl';
import Settings from '../Pages/settings';
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DroneDataContext } from '../../DroneDataContext';
import CameraComponent from '../Components/Camera'
// import DraggableCamera from '../Components/DraggableCamera';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Navigation: React.FC = () => {
    const [screen, setScreen] = useState('Guide');
    const dynamicFont = windowWidth * 0.012;
    const iconSize = windowHeight * 0.034;
    const droneDataContext = useContext(DroneDataContext);

    if (!droneDataContext) {
        throw new Error("Navigation must be used within a DroneDataProvider");
    }

    const { data } = droneDataContext;
    const [isCameraFullScreen, setIsCameraFullScreen] = useState(false);
    const [isCameraSmall, setIsCameraSmall] = useState(true);
    const [isCameraConnected, setIsCameraConnected] = useState(false);
    const handleCameraConnectedChange = (connected: boolean) => {
        setIsCameraConnected(connected);
        console.log('isCameraConnected state after update:', connected);
    }
    useLayoutEffect(() => {
        console.log('Current value of isCameraConnected:', isCameraConnected);
    }, [isCameraConnected]);

    const toggleCameraFullScreen = (event) => {
        event.stopPropagation();
        console.log('Camera toggled');
        setIsCameraFullScreen(!isCameraFullScreen);
    }

    const getUnderlineStyle = (tabName: string) => {
        return screen === tabName ? { borderBottomColor: 'white', borderBottomWidth: 2 } : null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <View style={styles.mainContainers}>
                    <View>
                        <TouchableOpacity style={[styles.button, getUnderlineStyle('Guide')]} onPress={() => setScreen('Guide')}>
                            <MaterialIcons name="map" size={iconSize} color="#fff" />
                            <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Guide</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.button, getUnderlineStyle('Mission')]} onPress={() => setScreen('Mission')}>
                            <MaterialIcons name="directions" size={iconSize} color="#fff" />
                            <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Mission</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.button, getUnderlineStyle('Settings')]} onPress={() => setScreen('Settings')}>
                            <MaterialIcons name="settings" size={iconSize} color="#fff" />
                            <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.mainContainers}>
                    <View>
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>{data?.Mod ?? '0'}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.wifi}>
                            <FontAwesome5 name="sort-amount-up-alt" size={iconSize} color="#fff" />
                            <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>{data?.alt ?? '0'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.wifi}>
                            <MaterialCommunityIcons name="satellite-uplink" size={iconSize} color="#fff" />
                            <Text style={[styles.buttonText, { fontSize: dynamicFont }, { color: '#39FF13' }]}>{data?.sat ?? '0'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.wifi}>
                        <MaterialCommunityIcons name="timer-sand" size={iconSize} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }, { color: '#39FF14' }]}>9:38 </Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.wifi}>
                            <MaterialCommunityIcons
                                name="wifi"
                                size={iconSize}
                                color={parseFloat(data?.lat ?? '0') !== 0 ? '#39FF14' : '#FF2400'}
                            />
                            <Text style={[styles.buttonText, { fontSize: dynamicFont }, { color: '#fff' }]}>
                                {parseFloat(data?.con ?? '0') !== 0 ? 'Connected' : 'Disconnected'}
                            </Text>

                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            {(screen === 'Guide' || screen === 'Mission') && (
                <TouchableOpacity onPress={toggleCameraFullScreen} style={isCameraFullScreen ? styles.cameraFullScreen : styles.cameraSmallScreen}>
                    <CameraComponent isCameraSmall={!isCameraFullScreen} onCameraConnectedChange={setIsCameraConnected} />
                </TouchableOpacity>
            )}


            <View style={styles.componentContainer}>
                <View style={[styles.page, screen === 'Guide' ? styles.active : styles.hidden]}>
                    <Guide />
                </View>
                <View style={[styles.page, screen === 'Mission' ? styles.active : styles.hidden]}>
                    <Mission />
                </View>
                <View style={[styles.page, screen === 'Settings' ? styles.active : styles.hidden]}>
                    <Settings />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    componentContainer: {
        flex: 1,
    }, cameraSmallScreen: {
        position: 'absolute',
        top: 90,
        left: 10,
        zIndex: 2,
    },

    cameraFullScreen: {
        width: windowWidth,
        height: windowHeight,
        top: 0,
        left: 0,
        zIndex: 2,
    }, page: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    active: {
        display: 'flex',
    },
    hidden: {
        display: 'none',
    },
    midContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingLeft: windowHeight * 0.02,
        paddingRight: windowHeight * 0.02,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 4,
        height: '10%',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        // fontSize: 12,
    },
    mainContainers: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        alignItems: 'center',
        marginRight: 10,
    },
    animatedContainer: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
    },
    wifi: {
        marginLeft: 12,
        gap: 3,
        alignItems: 'center',
    },
    gap: {
        marginRight: 5,
        borderRightWidth: 1,
        borderRightColor: '#fff',
        borderRightLeftRadius: 5,
        borderRightRightRadius: 5,
        paddingRight: 5,
        borderLeftWidth: 1,
        borderLeftColor: '#fff',
        borderLeftRadius: 5,
        paddingLeft: 5,
    },
});


export default Navigation;

