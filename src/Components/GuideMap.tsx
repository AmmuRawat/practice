import React, { useState, useCallback, forwardRef, useImperativeHandle, useEffect, useContext } from 'react';
import Mapbox from "@rnmapbox/maps";
import { StyleSheet, Dimensions, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { FeatureCollection, Point, LineString } from 'geojson';
import SwipeButton from '../Components/SwipeButton';
import styles from '../styles/MapComponent.styles';
Mapbox.setAccessToken('sk.eyJ1Ijoic2FtcGF0aGt1bWFyNDQ1IiwiYSI6ImNsaXB2YmdmbTBtYTYza28xbWY4Z3hjYTYifQ.GsFTD3GRI2Y-6kee7lkE9Q');
import { NativeModules } from 'react-native';
let markerLatitude = null;
let markerLongitude = null;
import haversineDistance from 'haversine-distance'
import _ from 'lodash';
import { DroneDataContext } from '../../DroneDataContext';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const { ConnectionModule } = NativeModules;;
const { MavlinkCommand } = NativeModules;
type Coordinates = [number, number];
const MapComponent = forwardRef<any, any>((props, ref) => {
    const droneDataContext = useContext(DroneDataContext);

    if (!droneDataContext) {
        throw new Error("LeftSidebar must be used within a DroneDataProvider");
    }

    const { data } = droneDataContext;
    // console.log(data.lat);
    const [initialAltitude, setInitialAltitude] = useState<Coordinates | null>([77.1928, 28.5457]);
    const [homeLocation, setHomeLocation] = useState<Coordinates | null | undefined>(null);
    const [marker, setMarker] = useState<number[] | null>(null);
    const [mapType, setMapType] = useState('SatelliteStreet');
    const [showPopup, setShowPopup] = useState(false);
    const [altitude, setAltitude] = useState(5);
    const [speed, setSpeed] = useState(2);
    const [zoomLevel, setZoomLevel] = useState(17.5);
    const [toggleState, setToggleState] = useState(true);
    const [planeHeading, setPlaneHeading] = useState<number>(0);
    const planeIcon = require('../assets/icons8-email-send-48(1).png');
    const markerIcon = require('../assets/icons8-pin-48.png');
    const takeoffIcon = require('../assets/icons8-helipad-32.png');
    const setMarkerAndResetToggle = (newMarker: number[]) => {
        setMarker(newMarker);
        setToggleState(true);
    };
    const [isInFlight, setIsInFlight] = useState(false);
    const [takeoffLocation, setTakeoffLocation] = useState<Coordinates | null>([77.1928, 28.5457]);
    const SOME_SMALL_THRESHOLD = 0.00001;
    const SOME_TAKEOFF_THRESHOLD = 1;
    const SOME_TAKEOFF_SPEED_THRESHOLD = 0.00001;
    const [showSwipeButton, setShowSwipeButton] = useState(false);
    const [rawHomeLatitude, setRawHomeLatitude] = useState<number | null>(null);
    const [rawHomeLongitude, setRawHomeLongitude] = useState<number | null>(null);
    const [homeLatitude, setHomeLatitude] = useState<number | null>(null);
    const [homeLongitude, setHhomeLongitude] = useState<number | null>(null);
    const [heading, setHeading] = useState<number | null>(null);
    const [rawHeading, setRawHeading] = useState<number | null>(null);
    const [centerCoordinate, setCenterCoordinate] = useState([77.1928, 28.5457]);

    const centerOnHomeLocation = () => {
        if (homeLocation && homeLocation.length === 2) {
            setCenterCoordinate(homeLocation);
            console.log('Attempting to center on:', homeLocation);

        }
    };
    useEffect(() => {
        if (props.clearOverlays) {
            setMarker(null);
            setToggleState(false);

        }
    }, [props.clearOverlays]);

    useEffect(() => {
        if (data) {
            setRawHomeLatitude(parseFloat(data.lat));
            setRawHomeLongitude(parseFloat(data.lon));
            setRawHeading(parseFloat(data.hdg));
        }
    }, [data]);


    useEffect(() => {
        if (rawHomeLatitude !== null && rawHomeLongitude !== null) {
            setHomeLocation([rawHomeLongitude, rawHomeLatitude]);
        }
    }, [rawHomeLatitude, rawHomeLongitude]);

    useEffect(() => {
        if (homeLocation && marker) {
            const distance = Math.sqrt(
                Math.pow(homeLocation[0] - marker[0], 2) +
                Math.pow(homeLocation[1] - marker[1], 2)
            );
            if (distance < SOME_SMALL_THRESHOLD) {
                setMarker(null);
            }
        }
    }, [homeLocation, marker]);

    useEffect(() => {
        if (heading !== null) {
            setPlaneHeading(heading - 90);
        }
    }, [heading]);

    useEffect(() => {
        if (rawHeading !== null) {
            setHeading(rawHeading);
        }
    }, [rawHeading]);

    useEffect(() => {
        if (rawHomeLatitude !== null) {
            setHomeLatitude(rawHomeLatitude);
        }
        if (rawHomeLongitude !== null) {
            setHhomeLongitude(rawHomeLongitude);
        }
        if (rawHeading !== null) {
            setHeading(rawHeading);
        }
    }, [rawHomeLatitude, rawHomeLongitude, rawHeading]);


    useImperativeHandle(ref, () => ({
        setMapType: (type) => setMapType(type),
        centerOnHome: centerOnHomeLocation,
        zoomIn: () => {
            setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 1, 22));
        },
        zoomOut: () => {
            setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 1, 0));
        }
    }));

    const onMapPress = useCallback((e) => {
        const newMarker = e.geometry.coordinates;
        markerLatitude = newMarker[1];
        markerLongitude = newMarker[0]

        setMarkerAndResetToggle(newMarker);
        setShowPopup(true);

    }, []);

    const handleToggle = (action: string) => {
        setToggleState(false);
        setShowSwipeButton(false);
    };
    let features: any[] = [
        (isInFlight && takeoffLocation) && {
            type: 'Feature',
            id: 'takeoffLocation',
            properties: {
                icon: 'takeoff',
            },
            geometry: {
                type: 'Point',
                coordinates: takeoffLocation,
            },
        },
        homeLocation && {
            type: 'Feature',
            id: 'homeLocation',
            properties: {
                icon: 'home',
                heading: planeHeading
            },
            geometry: {
                type: 'Point',
                coordinates: homeLocation,
            },
        },
        marker && {
            type: 'Feature',
            id: 'marker',
            properties: {
                icon: 'marker',
            },
            geometry: {
                type: 'Point',
                coordinates: marker,
            },
        },
    ].filter(Boolean) as any;

    // useEffect(() => {
    //     if (data?.alt && parseFloat(data.alt) < SOME_TAKEOFF_THRESHOLD) {
    //         setIsInFlight(false);  // Set isInFlight to false when altitude is below threshold
    //     }
    // }, [data]);


    if (homeLocation && marker) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [homeLocation, marker],
            },
        });
    }

    const mapData: FeatureCollection<Point | LineString> = {
        type: 'FeatureCollection',
        features: features,
    };

    useEffect(() => {
        console.log('clearOverlays:', props.clearOverlays);
        if (props.clearOverlays) {
            // Clear the overlays from the map
            setMarker(null);
            setToggleState(false);
        }
    }, [props.clearOverlays]);
    const toCoordinates = (arr: number[] | null): Coordinates => {
        if (arr === null) {
            throw new Error('Null value encountered when converting to Coordinates');
        }
        return [arr[0], arr[1]];
    }

    const handleNewFlight = () => {
        if (data) {
            const droneLocation: Coordinates = [parseFloat(data.lon), parseFloat(data.lat)];
            const initialCoordinates: Coordinates | null = initialAltitude ? [initialAltitude[0], initialAltitude[1]] : null;

            if (initialCoordinates) {
                const distance = haversineDistance(initialCoordinates, droneLocation);  // distance in meters

                if (distance > 0.0001 && parseFloat(data.vel) > SOME_TAKEOFF_SPEED_THRESHOLD) {
                    setTakeoffLocation([parseFloat(data.lon), parseFloat(data.lat)]);
                    setIsInFlight(true);  // Set isInFlight to true when a new flight is initiated
                    console.log("distance:", distance, "velocity:", parseFloat(data.vel));
                }
            } else {
                console.error("Initial coordinates are null");
            }
        }
    };

    const handleNewFlightalt = () => {
        if (data) {
            setInitialAltitude([parseFloat(data.lon), parseFloat(data.lat)]);
            // setIsInFlight(true);  // Set isInFlight to true when a new flight is initiated
        }
    };

    useEffect(() => {
        // console.log('Velocity useEffect triggered', data?.vel);
        if (data?.vel && parseFloat(data.vel) >= SOME_TAKEOFF_SPEED_THRESHOLD && !isInFlight) {
            handleNewFlight();  // Call handleNewFlight when speed is above threshold and not already in flight
        } else if (data?.vel && parseFloat(data.vel) < SOME_TAKEOFF_SPEED_THRESHOLD) {
            // setIsInFlight(false);  // Set isInFlight to false when speed is below threshold
        }
    }, [data]);

    useEffect(() => {
        // console.log('Altitude useEffect triggered', data?.alt);
        if (data?.alt && parseFloat(data.alt) >= SOME_TAKEOFF_THRESHOLD && !isInFlight) {
            handleNewFlightalt();  // Call handleNewFlight when altitude is above threshold and not already in flight
        } else if (data?.alt && parseFloat(data.alt) < SOME_TAKEOFF_THRESHOLD) {
            setIsInFlight(false);  // Set isInFlight to false when altitude is below threshold
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <Mapbox.MapView
                {...props}
                style={styles.map}
                styleURL={Mapbox.StyleURL[mapType]}
                onPress={onMapPress}
                logoEnabled={false}
                attributionEnabled={false}
            // attributionPosition={false}
            >
                <Mapbox.Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={centerCoordinate}
                    animationDuration={0}
                />
                <Mapbox.Images
                    images={{
                        home: planeIcon,
                        marker: markerIcon,
                        takeoff: takeoffIcon,
                    }}
                />

                <Mapbox.ShapeSource
                    id="markerSource"
                    hitbox={{ width: 20, height: 20 }}
                    onPress={(e) => {
                        if (e.features[0].id === 'marker') {
                            console.log('Marker itself pressed!');
                            setMarker(null);
                        }
                        else if (e.features[0].id === 'homeLocation') {
                            console.log('Home icon pressed!');
                        }
                    }}
                    shape={mapData}
                >
                    <Mapbox.LineLayer
                        id="lineLayer"
                        style={{
                            lineColor: mapType === 'Satellite' ? 'yellow' : mapType === 'Street' ? 'blue' : 'yellow',
                            lineWidth: 3,
                            lineDasharray: [1, 1]
                        }}
                    />

                    <Mapbox.SymbolLayer
                        id="planeSymbols"
                        style={{
                            iconImage: [
                                'match',
                                ['get', 'icon'],
                                'home', 'home',
                                'marker', 'marker',
                                'takeoff', 'takeoff',
                                'default-icon-id'
                            ],
                            iconRotate: [
                                'match',
                                ['get', 'icon'],
                                'home', ['get', 'heading'],
                                0
                            ],
                            iconAllowOverlap: true,
                            iconSize: [
                                'match',
                                ['get', 'icon'],
                                'home', 1.3,
                                'plane', 1,
                                'marker', 1,
                                'takeoff', 1.3,
                                1
                            ],
                            textField: ['get', 'number'],
                            textFont: ['Open Sans Bold'],
                            textSize: 15,
                            textAllowOverlap: true,
                            textOffset: [0, -0.2],
                            textColor: '#fff'
                        }}
                    />
                </Mapbox.ShapeSource>
            </Mapbox.MapView>
            {/* <View style={styles.blackOverlay}></View> */}
            {showPopup &&
                <View style={styles.modalView}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ALTITUDE :</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={text => setAltitude(Number(text))}
                            defaultValue={altitude.toString()}
                            keyboardType='number-pad'
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>SPEED      :</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={text => setSpeed(Number(text))}
                            defaultValue={speed.toString()}
                            keyboardType='number-pad'
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <View>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#06d6a0',
                                    padding: 10,
                                    alignItems: 'center',
                                    borderRadius: 5,

                                }}
                                onPress={() => {
                                    setShowPopup(false);
                                    setShowSwipeButton(true);
                                }}
                            >
                                <Text style={{ color: 'white' }}>SET</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#06d6a0',
                                    padding: 10,
                                    alignItems: 'center',
                                    borderRadius: 5,
                                }}
                                onPress={() => {
                                    setMarker(null);
                                    setShowPopup(false);
                                    setToggleState(false);
                                }}
                            >
                                <Text style={{ color: 'white' }}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }

            {marker && toggleState && showSwipeButton && (
                <View style={styles.swipeButtonContainer}>
                    <SwipeButton onToggle={() => {
                        handleToggle('marker');
                        MavlinkCommand.sendNextPosMessage(markerLatitude, markerLongitude, speed, altitude)

                    }} />
                </View>
            )}
        </View>
    );

});

export default MapComponent;
