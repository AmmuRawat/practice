import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, NativeModules, Alert, Text, Image, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';


const Calibration: React.FC = () => {
    const { width: windowWidth } = Dimensions.get('window');

    const dynamicFont = windowWidth * 0.017;

    return (
        <View>
            <View style={styles.Accel}>
                <Text style={[styles.AccelHead, { fontSize: dynamicFont }]}> Compass Priority </Text>


                <Text style={[styles.Text, { fontSize: dynamicFont }]}>A reboot is required to remap the above changes</Text>

                <View style={styles.button}>
                    <Button color="green" title=' REBOOT ' onPress={() => { }} />
                </View>


                <Text style={[styles.Text, { fontSize: dynamicFont }]}>Onboard Mag Calibration</Text>

                <View>

                    <Progress.Bar progress={0} width={400} height={40} />
                </View>
                <View style={styles.button}>
                    <Button color="green" title='  START  ' onPress={() => { }} />
                </View>

                <View>
                    <Text style={[styles.Text, { fontSize: dynamicFont }]}>hold the vehicle in the air and rotate it so that each side (front, back, left, right, top and bottom) points down towards the earth for a few seconds in turn. Consider a full 360-degree turn with each turn pointing a different direction of the vehicle to the ground. It will result in 6 full turns plus possibly some additional time and turns to confirm the calibration or retry if it initially does not pass.

                    </Text>
                    <Image source={require("../assets/compasscali.jpg")} />
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    Accel: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 15,

    },
    button: {
        backgroundColor: "green",
        textAlign: 'center',

    },
    AccelHead: {
        // marginTop:-50,
        color: "black",
        fontSize: 50,

    },
    buttonText: {
        textAlign: 'center',
    },
    Text: {
        paddingBottom: 15,
    },







})
export default Calibration;
