package com.drone250gm;

import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketTimeoutException;
import java.net.SocketException;


import com.MAVLink.MAVLinkPacket;
import com.MAVLink.Parser;
import com.MAVLink.common.*;
import com.MAVLink.enums.*;
import com.drone250gm.socketModule.*;


public class MissionModule extends ReactContextBaseJavaModule {
    private DatagramSocket socket;
    private Handler handler;

    private Handler uiHandler;

    private static final int MAVLINK_SET_POS_TYPE_MASK_POS_IGNORE = ((1 << 0) | (1 << 1) | (1 << 2));
    private static final int MAVLINK_SET_POS_TYPE_MASK_VEL_IGNORE = ((1 << 3) | (1 << 4) | (1 << 5));
    private static final int MAVLINK_SET_POS_TYPE_MASK_ACC_IGNORE = ((1 << 6) | (1 << 7) | (1 << 8));

    

    public MissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        handler = new Handler(Looper.getMainLooper());
        uiHandler = new Handler(Looper.getMainLooper()); 
    }

    @Override
    public String getName() {
        return "MissionModule";
    }

    @ReactMethod
    public void testMission(ReadableArray polylineCoordinates) throws IOException {
        try {

            Toast.makeText(getReactApplicationContext(), polylineCoordinates.size(), Toast.LENGTH_LONG).show();

        } catch (Exception e) {
            // Handle any exceptions here
        }
    }
        
    
@ReactMethod
public void CommandMission(ReadableArray polylineCoordinates) throws IOException {
try {

        int numberOfCoordinates = polylineCoordinates.size();

        msg_mission_count missionCount = new msg_mission_count();
        missionCount.target_system = 0;
        missionCount.target_component = 0;
        missionCount.count = (short) numberOfCoordinates;
        MAVLinkPacket PacketmissionCount= missionCount.pack();
        byte[] encodedmissionCount = PacketmissionCount.encodePacket();
        DatagramPacket missionCountPacket = new DatagramPacket(encodedmissionCount, encodedmissionCount.length,socketModule.hostAddIP(), socketModule.hostPortIP());
        socketModule.send(missionCountPacket);

    for (int i = 0; i < numberOfCoordinates+1; i++) {
        ReadableMap coordinateObject = polylineCoordinates.getMap(i);
        ReadableArray coordinatesArray = coordinateObject.getArray("coordinate");
        float altitude = (float) coordinateObject.getDouble("altitude");

        double latitude = coordinatesArray.getDouble(1);
        double longitude = coordinatesArray.getDouble(0);

        msg_mission_item waypoint = new msg_mission_item();

        waypoint.target_system = 0;
        waypoint.target_component = 0;
        waypoint.seq = (short)i;
        waypoint.frame = MAV_FRAME.MAV_FRAME_GLOBAL_RELATIVE_ALT;
        waypoint.command = MAV_CMD.MAV_CMD_NAV_WAYPOINT;
        waypoint.current = 0;
        waypoint.autocontinue = 0;
        waypoint.param1 = 0;
        waypoint.param2 = 0;
        waypoint.param3 = 0;
        waypoint.param4 = 0;
        waypoint.x = (float)latitude;
        waypoint.y = (float)longitude;
        waypoint.z = altitude;
        // waypoint.missionType = 0;

        MAVLinkPacket Packetwaypoint= waypoint.pack();
        byte[] encodedwaypoint = Packetwaypoint.encodePacket();
        DatagramPacket waypointPacket = new DatagramPacket(encodedwaypoint, encodedwaypoint.length,socketModule.hostAddIP(), socketModule.hostPortIP());
        socketModule.send(waypointPacket);
    
}

    } catch (Exception e) {
    e.printStackTrace();
}
}}