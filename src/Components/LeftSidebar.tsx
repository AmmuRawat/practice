import React, { useContext, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    StyleSheet, View, Text, Dimensions
} from 'react-native';
import Toast from 'react-native-toast-message';
import { DroneDataContext } from '../../DroneDataContext';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const dynamicFont = windowWidth * 0.017;

const LeftSidebar: React.FC = () => {
    const droneDataContext = useContext(DroneDataContext);

    if (!droneDataContext) {
        throw new Error("LeftSidebar must be used within a DroneDataProvider");
    }

    const { data } = droneDataContext;


    return (
        <View style={styles.drawerContainer}>
            <View style={styles.midContainer2}>
                <View style={styles.midContainer2}>
                    <View style={styles.gap2}>
                        <MaterialCommunityIcons name="latitude" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Lat:- {data?.lat ?? '0'}</Text>
                    </View>
                    <View style={styles.gap2}>
                        <MaterialCommunityIcons name="longitude" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Lon:- {data?.lon ?? '0'}</Text>
                    </View>

                    <View style={styles.gap2}>
                        <MaterialIcons name="height" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Alt:- {data?.alt ?? '0'}</Text>
                    </View>
                    <View style={styles.gap2}>
                        <MaterialCommunityIcons name="sign-direction" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Heading:- {data?.hdg ?? '0'}</Text>
                    </View>
                    <View style={styles.gap2}>
                        <MaterialCommunityIcons name="satellite-uplink" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Sat:-  {data?.sat ?? '0'}</Text>
                    </View>

                    {/* <View style={styles.gap2}>
                        <MaterialCommunityIcons name="battery" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Battery:- {data.battery}%</Text>
                    </View>
                    <View style={styles.gap2}>
                        <MaterialCommunityIcons name="speedometer-slow" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>DS:- {data.ds} M/S</Text>
                    </View>

                    <View style={styles.gap2}>
                        <MaterialCommunityIcons name="timer-sand" size={windowWidth * 0.025} color="#fff" />
                        <Text style={[styles.buttonText, { fontSize: dynamicFont }]}>Time Left:- {data.timeLeft} sec</Text>
                    </View> */}

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    drawerContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'flex-start',
    }, midContainer: {
        position: 'absolute',
        top: 10,
        left: 40,
        zIndex: 100,
    }
    , midContainer2: {
        position: 'absolute',
        top: 60,
        zIndex: 100,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    }, gap2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 20,
        marginBottom: 13,
        gap: 7
    },

})

export default LeftSidebar;

