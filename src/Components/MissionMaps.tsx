import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef, useEffect, useContext } from 'react';
import Mapbox from "@rnmapbox/maps";
import { StyleSheet, Dimensions, View, TextInput, Button, Text, TouchableOpacity, ScrollView, NativeModules, Modal } from 'react-native';
import { FeatureCollection, Point, LineString } from 'geojson';
import SwipeButton from './SwipeButton';
import SwipeToUpload from './SwipeToUpload';
import _ from 'lodash';
import { DroneDataContext } from '../../DroneDataContext';
import haversineDistance from 'haversine-distance'

const { MissionModule } = NativeModules;
const { MavlinkCommand } = NativeModules;
const { ConnectionModule } = NativeModules;

Mapbox.setAccessToken('sk.eyJ1Ijoic2FtcGF0aGt1bWFyNDQ1IiwiYSI6ImNsaXB2YmdmbTBtYTYza28xbWY4Z3hjYTYifQ.GsFTD3GRI2Y-6kee7lkE9Q');

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    map: {
        flex: 1
    }, container: {
        flex: 1,
        flexDirection: 'row'
    }, modalView: {
        position: 'absolute',
        height: windowWidth * 0.177,
        top: windowHeight * 0.20,
        left: windowWidth * 0.275,
        zIndex: 2,
        margin: windowHeight * 0.17,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        paddingTop: windowHeight * 0.04,
        alignItems: "center",
        borderColor: '#06d6a0',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: windowWidth * 0.26,
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        // paddingTop: windowHeight * 0.01,
    },
    inputLabel: {
        fontSize: windowHeight * 0.020,
        fontWeight: 'bold',
        marginRight: windowHeight * 0.05,
        color: '#fff'
    },
    textInput: {
        height: windowHeight * 0.06,
        width: "20%",
        borderColor: '#06d6a0',
        borderRadius: 10,
        color: "white",
        borderWidth: 2,
        fontSize: windowHeight * 0.025,
        paddingLeft: windowHeight * 0.03,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "90%",
    },

    button: {
        borderRadius: windowHeight * 0.02,
        padding: 10,
        elevation: 2,
        backgroundColor: "#2196F3",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    swipeButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        padding: 10,
    },
    waypointContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginVertical: 2,
        padding: 10,
        textAlign: 'center',
        borderRadius: 5,
        marginBottom: 5
    }, text: {
        color: '#fff'
    },
    waypointContainer2: {
        // backgroundColor: 'rgba(0,0,0,0.5)',
        marginVertical: 2,
        // padding: 5,
        borderRadius: 5,
        flexDirection: 'row',
        gap: 10,
        textAlign: 'center'
        // justifyContent: 'space-between',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "flex-end",
        marginTop: -25,
        // right: 220
    },
    editPopUp: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
    editPopUpField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    }, label: {
        color: '#fff'
    }
    ,
    input: {
        height: 40,
        width: 70,
        color: '#fff',
        // margin: 22,
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
    },

    editPopUpButtons: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        gap: 10,
        marginTop: 5,
    },

    sidebar: {
        position: 'absolute',
        right: 0,
        flex: 1, // changed from 0.2 to 1
        top: 80,
        height: '100%', // changed from 90.5% to 100%
        maxHeight: '100%', // added this line to ensure max height
        // width: '15%',
        // backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 90,
        padding: 10,
    },
    mapWithSidebar: {
        // flex: 0.75,
    },

})
type LatLng = [number, number];


interface WaypointProps {
    number: number;
    onDelete: () => void;
    altitude: number;
    speed: number;
    onEdit: (altitude: number, speed: number) => void;
}
type WaypointType = {
    id: number;
    coordinate: LatLng;
    altitude: number;
    number: number;
    speed: number;
};

type MissionType = {
    coordinates: LatLng;
    altitude: number;
    speed: number;
};

const newData: WaypointType[] = [
    {
        id: Date.now(),
        number: 0,
        altitude: 10,
        coordinate: [77.1826334555575, 28.56031931488468],
        speed: 5
    }
];

const Waypoint: React.FC<WaypointProps> = ({ number, onDelete, altitude, speed, onEdit }) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newAltitude, setNewAltitude] = useState(altitude.toString());
    const [newSpeed, setNewSpeed] = useState(speed.toString());

    const handleEdit = () => {
        onEdit(parseFloat(newAltitude), parseFloat(newSpeed));
        setEditModalVisible(false);
    };

    return (
        <View style={styles.waypointContainer}>
            <Text style={styles.text}>Waypoint {number}</Text>
            <View style={styles.waypointContainer2}>
                <Button title="Delete" color="#06d6a0" onPress={onDelete} />
                <Button title="Edit" color="#06d6a0" onPress={() => setEditModalVisible(true)} />
            </View>
            <Modal
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>ALTITUDE :</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={setNewAltitude}
                                defaultValue={altitude.toString()}
                                keyboardType='number-pad'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>SPEED      :</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={setNewSpeed}
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
                                    onPress={() => handleEdit()}

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
                                        setEditModalVisible(false)
                                    }}
                                >
                                    <Text style={{ color: 'white' }}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

type Coordinates = [number, number];

const MapComponent = forwardRef<any, any>((props, ref) => {

    const droneDataContext = useContext(DroneDataContext);

    if (!droneDataContext) {
        throw new Error("LeftSidebar must be used within a DroneDataProvider");
    }

    const { data } = droneDataContext;
    const [initialAltitude, setInitialAltitude] = useState<Coordinates | null>([77.1928, 28.5457]);

    const [homeLocation, setHomeLocation] = useState<number[] | null | undefined>(null);
    const [marker, setMarker] = useState<number[] | null>(null);
    const [mapType, setMapType] = useState('SatelliteStreet');
    const [showPopup, setShowPopup] = useState(false);
    const [altitude, setAltitude] = useState(5);
    const [showSidebar, setShowSidebar] = useState(true);
    const [speed, setSpeed] = useState(2);
    const [zoomLevel, setZoomLevel] = useState(17.5);
    const [toggleState, setToggleState] = useState(true);
    const [canSwipeToUpload, setCanSwipeToUpload] = useState(true);
    const [showSwipeToFly, setShowSwipeToFly] = useState(false);
    const [markers, setMarkers] = useState<WaypointType[]>([]);
    const [mission, setMission] = useState<MissionType[]>([]);
    const [planeHeading, setPlaneHeading] = useState<number>(0);
    const planeIcon = require('../assets/icons8-email-send-48(1).png');
    const markerIcon = require('../assets/icons8-pin-48.png');
    const takeoffIcon = require('../assets/icons8-helipad-32.png');
    const [isInFlight, setIsInFlight] = useState(false);
    const [takeoffLocation, setTakeoffLocation] = useState<Coordinates | null>([77.1928, 28.5457]);
    const SOME_SMALL_THRESHOLD = 0.00001;
    const SOME_TAKEOFF_THRESHOLD = 1;
    const SOME_TAKEOFF_SPEED_THRESHOLD = 0.00001;
    const [homeLatitude, setHomeLatitude] = useState<number | null>(null);
    const [homeLongitude, setHhomeLongitude] = useState<number | null>(null);
    const [heading, setHeading] = useState<number | null>(null);
    const [uploadedAck, setuploadedAck] = useState<number | null>(null);
    const [missionCompleted, setMissionCompleted] = useState(false);
    const [centerCoordinate, setCenterCoordinate] = useState([77.1928, 28.5457]);

    const [udpData, setUdpData] = useState({
        rawAltitude: 0,
        rawVelocity: 0,
        rawSatellites: 0,
        rawHomeLatitude: 0,
        rawHomeLongitude: 0,
        rawConnected: 0,
        rawMode: '',
        rawMisack: 0,
        rawHeading: 0,
    });
    useEffect(() => {
        if (homeLocation && markers.length > 0) {
            const lastWaypoint = markers[markers.length - 1].coordinate;
            const distanceToLastWaypoint = getDistanceBetweenPoints(homeLocation, lastWaypoint);

            if (distanceToLastWaypoint < 5) {
                setMissionCompleted(true);
                setMarkers([]);
                setMission([]);
            }
        }
    }, [homeLocation]);

    function getDistanceBetweenPoints(point1, point2) {
        const lat1 = point1[1];
        const lon1 = point1[0];
        const lat2 = point2[1];
        const lon2 = point2[0];
        const R = 6371e3; // meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }


    const centerOnHomeLocation = () => {
        if (homeLocation && homeLocation.length === 2) {
            setCenterCoordinate(homeLocation);
            console.log('Attempting to center on:', homeLocation);
        }
    };

    useEffect(() => {

        if (data) {
            setUdpData({
                rawAltitude: parseFloat(data.alt),
                rawVelocity: parseFloat(data.vel),
                rawSatellites: parseFloat(data.sat),
                rawHomeLatitude: parseFloat(data.lat),
                rawHomeLongitude: parseFloat(data.lon),
                rawHeading: parseFloat(data.hdg),
                rawConnected: 0,
                rawMode: data.Mod,
                rawMisack: parseInt(data.ack),

            });
        }
    }, [data]);
    useEffect(() => {
        if (udpData.rawHomeLatitude !== null && udpData.rawHomeLongitude !== null) {
            setHomeLocation([udpData.rawHomeLongitude, udpData.rawHomeLatitude]);
        }
    }, [homeLatitude, homeLongitude]);

    useEffect(() => {
        if (udpData.rawHeading !== null) {
            setPlaneHeading(udpData.rawHeading - 90);
        }
    }, [udpData.rawHeading]);
    useEffect(() => {
        if (udpData.rawHomeLatitude !== null) {
            setHomeLatitude(udpData.rawHomeLatitude);
        }
        if (udpData.rawHomeLongitude !== null) {
            setHhomeLongitude(udpData.rawHomeLongitude);
        }
        if (udpData.rawHeading !== null) {
            setHeading(udpData.rawHeading);
        }
        if (udpData.rawMisack !== null) {
            if (udpData.rawMisack === 1) {
                setuploadedAck(1);
                setShowSwipeToFly(true);

            }
        }

    }, [udpData.rawHomeLatitude, udpData.rawHomeLongitude, udpData.rawHeading, udpData.rawMisack]);


    useEffect(() => {
        console.log("Number of Markers: ", markers.length);
    }, [markers]);
    const [polylineCoordinates, setPolylineCoordinates] = useState<LatLng[]>([]);

    const onMapPress = useCallback((e) => {
        if (!isMounted.current) return;

        const newWaypointCount = markers.length + 1;
        if (markers.length > 0) {
            setCanSwipeToUpload(true);
        }
        const newMarker: WaypointType = {
            id: Date.now(),
            number: newWaypointCount,
            coordinate: e.geometry.coordinates as LatLng,
            altitude,
            speed
        };

        const newMissionData: MissionType = {
            coordinates: newMarker.coordinate,
            altitude,
            speed
        };
        setShowSidebar(true);
        setMission(prevMission => [...prevMission, newMissionData]);
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);

        setShowPopup(true);

        setToggleState(true);

        console.log("newWaypointCount: ", newWaypointCount);

    }, [altitude, speed, markers]);


    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

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
    let missionFeatures = mission.map((waypoint, index) => ({
        type: 'Feature',
        id: `mission-${markers[index].id}`,
        properties: {
            icon: 'marker',
            number: `${index + 1}`,
        },
        geometry: {
            type: 'Point',
            coordinates: waypoint.coordinates,
        }
    }));

    let missionLines = mission.slice(1).map((waypoint, index) => ({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [mission[index].coordinates, waypoint.coordinates],
        },
    }));


    const handleShapePress = useCallback((e) => {
        if (!isMounted.current) return;

        if (e.features[0].id === 'marker') {
            console.log('Marker itself pressed!');
            setMarker(null);
        }
        else if (e.features[0].id === 'homeLocation') {
            console.log('Home icon pressed!');
        }
    }, []);

    const handleToggle = async (action: string) => {
        if (action === 'upload') {
            setCanSwipeToUpload(false);
            setShowSidebar(false); // hide the sidebar

        } else if (action === 'fly') {
            setShowSwipeToFly(false);
        }
        setToggleState(false);
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
    if (homeLocation && marker) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [homeLocation, marker],
            },
        });
    }
    features = [
        ...features,
        ...missionFeatures,
        ...missionLines
    ];

    const mapData: FeatureCollection<Point | LineString> = {
        type: 'FeatureCollection',
        features: features,
    };

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
        }
    };

    useEffect(() => {
        if (data?.vel && parseFloat(data.vel) >= SOME_TAKEOFF_SPEED_THRESHOLD && !isInFlight) {
            handleNewFlight();  // Call handleNewFlight when speed is above threshold and not already in flight
        } else if (data?.vel && parseFloat(data.vel) < SOME_TAKEOFF_SPEED_THRESHOLD) {
        }
    }, [data]);

    useEffect(() => {
        if (data?.alt && parseFloat(data.alt) >= SOME_TAKEOFF_THRESHOLD && !isInFlight) {
            handleNewFlightalt();  // Call handleNewFlight when altitude is above threshold and not already in flight
        } else if (data?.alt && parseFloat(data.alt) < SOME_TAKEOFF_THRESHOLD) {
            setIsInFlight(false);  // Set isInFlight to false when altitude is below threshold
        }
    }, [data]);
    useEffect(() => {
        if (homeLocation && markers.length > 0) {
            const lastWaypoint = markers[markers.length - 1].coordinate;
            const distanceToLastWaypoint = getDistanceBetweenPoints(homeLocation, lastWaypoint);

            if (distanceToLastWaypoint < 5) {
                console.log('Clearing markers and mission');
                setMissionCompleted(true);
                setMarkers([]);
                setMission([]);
            }
        }
    }, [homeLocation]);

    return (
        <>
            <View style={styles.container}>
                <Mapbox.MapView
                    {...props}
                    style={[styles.map, showSidebar && markers.length > 0 ? styles.mapWithSidebar : {}]}
                    styleURL={Mapbox.StyleURL[mapType]}
                    onPress={onMapPress}
                    logoEnabled={false}
                    attributionEnabled={false}
                >
                    <Mapbox.Camera
                        zoomLevel={zoomLevel}
                        centerCoordinate={centerCoordinate}
                        animationDuration={0}
                    />

                    <Mapbox.Images

                        images={{
                            takeoff: takeoffIcon,
                            home: planeIcon,
                            marker: markerIcon,
                        }}
                    />

                    <Mapbox.ShapeSource
                        id="markerSource"
                        hitbox={{ width: 20, height: 20 }}
                        onPress={(e) => {
                            const featureId = e.features[0]?.id;
                            if (typeof featureId === 'string' && featureId.startsWith('mission-')) {
                                const missionIndex = parseInt(featureId.split('-')[1], 10);
                                console.log(`Mission waypoint #${missionIndex} pressed`);
                            } else if (featureId === 'marker') {
                                console.log('Marker itself pressed!');
                                setMarker(null);
                            } else if (featureId === 'homeLocation') {
                                console.log('Home icon pressed!');
                            }
                            handleShapePress
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
                {markers.length > 1 && canSwipeToUpload && (
                    <View style={styles.swipeButtonContainer}>
                        {<SwipeToUpload onToggle={() => {
                            handleToggle('upload');
                            console.log("uploaded")
                            markers.unshift(...newData);
                            console.log(markers)

                            for (let i = 1; i <= 6; i++) {
                                MissionModule.CommandMission(markers);
                            }

                        }} />}
                    </View>
                )}

                {showSwipeToFly && (
                    <View style={styles.swipeButtonContainer}>
                        {showSwipeToFly && <SwipeButton onToggle={() => {
                            handleToggle('fly');
                            console.log("fly")
                            MavlinkCommand.sendAutoMessage();

                        }} />}
                    </View>
                )}
                {showSidebar && markers.length > 0 && (
                    <ScrollView style={styles.sidebar}>
                        {markers.map((marker) => (
                            <Waypoint
                                key={marker.id}
                                number={marker.number}
                                altitude={marker.altitude}
                                speed={marker.speed}
                                onDelete={() => {
                                    setMarkers(prevMarkers => {
                                        const newMarkers = prevMarkers.filter(m => m.id !== marker.id);
                                        setPolylineCoordinates(newMarkers.map(marker => marker.coordinate));
                                        return newMarkers.map((m, index) => {
                                            return { ...m, number: index + 1 };
                                        });

                                    });

                                    setMission(prevMission => {
                                        const markerId = `mission-${marker.id}`;
                                        setCanSwipeToUpload(true);
                                        setShowSwipeToFly(false);
                                        const newMission = prevMission.filter((m, idx) => `mission-${markers[idx].id}` !== markerId);
                                        return newMission;
                                    });
                                }}

                                onEdit={(newAltitude, newSpeed) => {
                                    setMarkers(prevMarkers => {
                                        const newMarkers = prevMarkers.map(m => {
                                            if (m.id === marker.id) {
                                                return { ...m, altitude: newAltitude, speed: newSpeed };
                                            }
                                            return m;
                                        });
                                        return newMarkers;
                                    });
                                }}
                            />
                        ))}

                    </ScrollView>
                )}

            </View>

        </>
    );
});

export default MapComponent;
