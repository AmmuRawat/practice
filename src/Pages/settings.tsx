import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Acceleration from '../Settings/Acceleration';
import Calibration from '../Settings/Calibration';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Settings = () => {
    const [selectedSetting, setSelectedSetting] = useState('instructions');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const dynamicFont = windowWidth * 0.023;

    const renderContent = () => {
        switch (selectedSetting) {
            case 'instructions':
                return <Text>Instructions content here</Text>;
            case 'calibration':
                return <Calibration />;
            case 'acceleration':
                return <Acceleration />;
            case 'video':
                return <Text>This is video recording section</Text>;
            case 'image':
                return <Text>This is captured image</Text>;
            default:
                return null;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <TouchableOpacity style={[styles.option, selectedSetting === 'instructions' && styles.selectedOption]} onPress={() => { setSelectedSetting('instructions'); setDropdownOpen(false) }}>
                    <Text style={[styles.optionText, { fontSize: dynamicFont }, selectedSetting === 'instructions' && styles.selectedText]}>Instructions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.option, selectedSetting === 'calibration' && styles.selectedOption]} onPress={() => { setSelectedSetting('calibration'); setDropdownOpen(false) }}>
                    <Text style={[styles.optionText, { fontSize: dynamicFont }, selectedSetting === 'calibration' && styles.selectedText]}>Calibration</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.option, selectedSetting === 'acceleration' && styles.selectedOption]} onPress={() => { setSelectedSetting('acceleration'); setDropdownOpen(false) }}>
                    <Text style={[styles.optionText, { fontSize: dynamicFont }, selectedSetting === 'acceleration' && styles.selectedText]}>Acceleration</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={[styles.option, selectedSetting === 'chatting' && styles.selectedOption]} onPress={() => { setSelectedSetting('chatting'); setDropdownOpen(false) }}>
                    <Text style={[{ fontSize: dynamicFont }, selectedSetting === 'chatting' && styles.selectedText]}>Chatting</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                    style={[
                        styles.option,
                        (isDropdownOpen && selectedSetting !== 'video' && selectedSetting !== 'image') ? styles.selectedOption : null
                    ]}
                    onPress={() => {
                        if (selectedSetting !== 'video' && selectedSetting !== 'image') {
                            setDropdownOpen(!isDropdownOpen);
                        }
                        setSelectedSetting('');
                    }}
                >
                    <Text style={[
                        { fontSize: dynamicFont },
                        (isDropdownOpen && selectedSetting !== 'video' && selectedSetting !== 'image') ? styles.selectedText : null
                    ]}>Records</Text>
                </TouchableOpacity> */}

                {/* {isDropdownOpen &&
                    <View style={styles.dropdown}>
                        <TouchableOpacity style={[styles.dropdownOption, selectedSetting === 'video' && styles.selectedOption]} onPress={() => setSelectedSetting('video')}>
                            <Text style={[selectedSetting === 'video' && styles.selectedText, { fontSize: dynamicFont }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dropdownOption, styles.option, selectedSetting === 'image' && styles.selectedOption]} onPress={() => setSelectedSetting('image')}>
                            <Text style={[selectedSetting === 'image' && styles.selectedText, { fontSize: dynamicFont }]}>Captured Image</Text>
                        </TouchableOpacity>
                    </View>
                } */}
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );

};


const styles = StyleSheet.create({
    optionText: {
        color: '#a9a9a9',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        flex: 0.2,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#222222',
        zIndex: 1,
        top: windowHeight * 0.14
    },
    option: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#a9a9a9',
        padding: windowHeight * 0.019,
        backgroundColor: '#222222',
    },
    selectedOption: {
        backgroundColor: '#a9a9a9',
    },
    selectedText: {
        color: '#222222',
    },
    content: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        top: windowWidth * 0.01,
        // left: 60
    },
});



export default Settings;

