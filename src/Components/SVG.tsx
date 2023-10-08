import Svg, { Circle, Path } from 'react-native-svg';
import React, { FC, ReactNode } from 'react';
import {
    StyleSheet, View
} from 'react-native';

type MapPinSVGProps = {
    color?: string;
    children?: ReactNode;
};

const MapPinSVG: FC<MapPinSVGProps> = ({ children, color = 'black' }) => {
    return (
        <View style={styles.svgContainer}>
            <Svg height="50" width="50">
                <Circle cx="25" cy="25" r="15" stroke="red" strokeWidth="2" fill="red" />
                <Path d="M25 15 L30 30 L25 50 L20 30 Z" fill="red" />
            </Svg>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    svgContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    }
})

export default MapPinSVG;
