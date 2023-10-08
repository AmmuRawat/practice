import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, NativeModules, Alert, Text, Image, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';


const Acceleration: React.FC = () => {
    const { width: windowWidth } = Dimensions.get('window');

    const dynamicFont = windowWidth * 0.017;

    return (
        <View>
            <Text> This is the Acceleration</Text>
            <View style={styles.Accel}>
                <Text style={[styles.AccelHead, { fontSize: dynamicFont }]}> Accelerometer Calibration </Text>
                <View style={{ borderBottomColor: "black", borderBottomWidth: 1 }} />

                <Text style={[styles.Text, { fontSize: dynamicFont }]}>         Level your Autopilot to set default accelerometer Min/max (axix).{'\n'}         This will ask you your autopilot on each edge.</Text>
                <View style={styles.button}>
                    <Button color="green" title='  CALIBRATE ACCEL ' onPress={() => { }} />
                </View>

                <Text style={[styles.Text, { fontSize: dynamicFont }]}>        Level your Autopilot to set default accelerometer offsets (1 axis/AHRS trims).{'\n'}        This requires you to place your autopilot flat and level</Text>
                <View style={styles.button}>
                    <Button color="green" title='  CALIBRATE LAVEL ' onPress={() => { }} />
                </View>

                {/* <Text style={[styles.Text, { fontSize: dynamicFont }]}>    Level your Autopilot to set default accelerometer scale factors for level flight (1 axis).{'\n'}       This requires you to place your autopilot flat and level.</Text>
                                            <TouchableOpacity style={styles.button} >
                                                    <Text style={[styles.buttonText, { fontSize: dynamicFont }]}> Simple Accel Cal</Text>
                                            </TouchableOpacity> */}

                <View>
                    <Text style={[styles.Text, { fontSize: dynamicFont }]}>Click Calibrate Accel to start the full 3-axis calibration.

                        place the vehicle on each axis during the calibration. Press any key to indicate that the autopilot is in position and then proceed to the next orientation.
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

export default Acceleration;
