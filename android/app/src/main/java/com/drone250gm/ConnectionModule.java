package com.drone250gm;

import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketTimeoutException;
// import java.net.InetAddress;
import java.net.SocketException;
import java.util.HashMap;
// import java.net.Socket;
import java.text.DecimalFormat;

import java.util.ArrayList;
import java.util.List;
import java.net.InetAddress;

import com.MAVLink.MAVLinkPacket;
import com.MAVLink.Parser;
import com.MAVLink.common.*;
import com.MAVLink.enums.*;
import java.util.Timer;
import java.util.TimerTask; // Import Timer and TimerTask classes from java.util

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.drone250gm.socketModule.*;
import com.drone250gm.MavlinkCommand.*;

// import src.org.freedesktop.gstreamer.Gst;

public class ConnectionModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "ConnectionModule";
    private static final int TIMEOUT = 10000; // Timeout in milliseconds
    public volatile boolean stopReceiveUDP = false;
    // public DatagramSocket socket;
    private Handler handler;

    public int hostPort;
    // private int serverPort;
    public InetAddress hostAdd;

    private static final int MAVLINK_SET_POS_TYPE_MASK_POS_IGNORE = ((1 << 0) | (1 << 1) | (1 << 2));
    private static final int MAVLINK_SET_POS_TYPE_MASK_VEL_IGNORE = ((1 << 3) | (1 << 4) | (1 << 5));
    private static final int MAVLINK_SET_POS_TYPE_MASK_ACC_IGNORE = ((1 << 6) | (1 << 7) | (1 << 8));

    public int satellites;
    public int command_ack_value;
    public int command_ack_result;
    public double velocity;
    public double relativeAltitude;
    public double absoluteAltitude;
    public double latitude;
    public double longitude;
    public double heading;
    public String heartbeat;
    public int sysStatus;
    public int mavlinkId;
    private Handler uiHandler;
    private int telemReqFlag = 1;
    private DatagramSocket socket;
    private long startTime;
    private long endTime;
    private long duration;
    private int Mode;
    private int MisAck;
    private final ReactApplicationContext reactContext;

    private static final long DISCONNECT_TIMEOUT = 3000; // 30000=30 seconds timeout
    private long lastDataReceivedTime = 0;
    private long ackTime = 0;
    private long hbtackTime=0;

    private boolean isSocketClosed = false;

    HashMap<String, String> dronesData = new HashMap<>();

    public ConnectionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext; // Initialize the member variable
        handler = new Handler(Looper.getMainLooper());
        uiHandler = new Handler(Looper.getMainLooper());
    }

    @Override
    public String getName() {
        dronesData.put("ack", "0");
        dronesData.put("Hbt", "0");
        dronesData.put("Mod", "0");
        dronesData.put("lat", "0");
        dronesData.put("lon", "0");
        dronesData.put("alt", "0");
        dronesData.put("vel", "0");
        dronesData.put("hdg", "0");
        dronesData.put("sat", "0");
        return "ConnectionModule";
    }
    
    private void showToastOnUiThread(final String message) {
        uiHandler.post(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @ReactMethod
    public void receiveUDP(final int port, Promise promise) {

        socket = socketModule.socketPort(); // set 14550 to connect with drone and 14551 to connect with sitl
        // HashMap<String, Double> dronesData = new HashMap<>();
        // dronesData.put("ack","0");
        // dronesData.put("Hbt","0");
        // dronesData.put("Mod","0");
        // dronesData.put("lat","0");
        // dronesData.put("lon","0");
        // dronesData.put("alt","0");
        // dronesData.put("vel","0");
        // dronesData.put("hdg","0");
        // dronesData.put("sat","0");

        Thread udpThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    startTime = System.currentTimeMillis();

                    byte[] bufferReceiver = new byte[1024];
                    Parser mavLinkParser = new Parser();
                    socket.receive(socketModule.packetReceived());

                    hostAdd = socketModule.hostAddIP();
                    hostPort = socketModule.hostPortIP();

                    if (telemReqFlag == 1) { // setting this flag to send the telemetry req messages for once

                        msg_command_long heartbeat_msg = new msg_command_long();
		  		
                        heartbeat_msg.param1 = 0;
                        heartbeat_msg.param2 = 500;
                        heartbeat_msg.param3 = 0;
                        heartbeat_msg.param4 = 0;
                        heartbeat_msg.param5 = 0;
                        heartbeat_msg.param6 = 0;
                        heartbeat_msg.param7 = 0;
                        heartbeat_msg.command = 511;
                        heartbeat_msg.target_system = 0;
                        heartbeat_msg.target_component = 0;
                        heartbeat_msg.confirmation = 0;
                        MAVLinkPacket Packetheartbeat_msg = heartbeat_msg.pack();
                        byte[] encodedheartbeat_msg = Packetheartbeat_msg.encodePacket();
                        DatagramPacket heartbeat_msgPacket = new DatagramPacket(encodedheartbeat_msg,
                                encodedheartbeat_msg.length, hostAdd, hostPort);

                        msg_command_long stream_global_position = new msg_command_long();

                        stream_global_position.param1 = 33;
                        stream_global_position.param2 = 500;
                        stream_global_position.param3 = 0;
                        stream_global_position.param4 = 0;
                        stream_global_position.param5 = 0;
                        stream_global_position.param6 = 0;
                        stream_global_position.param7 = 0;
                        stream_global_position.command = 511;
                        stream_global_position.target_system = 0;
                        stream_global_position.target_component = 0;
                        stream_global_position.confirmation = 0;

                        MAVLinkPacket Packetstream_global_position = stream_global_position.pack();
                        byte[] encodedstream_global_position = Packetstream_global_position.encodePacket();
                        DatagramPacket stream_global_positionPacket = new DatagramPacket(encodedstream_global_position,
                                encodedstream_global_position.length, hostAdd, hostPort);

                        msg_command_long stream_gps_raw_int = new msg_command_long();

                        stream_gps_raw_int.param1 = 24;
                        stream_gps_raw_int.param2 = 500;
                        stream_gps_raw_int.param3 = 0;
                        stream_gps_raw_int.param4 = 0;
                        stream_gps_raw_int.param5 = 0;
                        stream_gps_raw_int.param6 = 0;
                        stream_gps_raw_int.param7 = 0;
                        stream_gps_raw_int.command = 511;
                        stream_gps_raw_int.target_system = 0;
                        stream_gps_raw_int.target_component = 0;
                        stream_gps_raw_int.confirmation = 0;

                        MAVLinkPacket Packetstream_gps_raw_int = stream_gps_raw_int.pack();
                        byte[] encodedstream_gps_raw_int = Packetstream_gps_raw_int.encodePacket();
                        DatagramPacket stream_gps_raw_intPacket = new DatagramPacket(encodedstream_global_position,
                                encodedstream_global_position.length, hostAdd, hostPort);

                        msg_command_long mission_ack = new msg_command_long();

                        mission_ack.param1 = msg_mission_ack.MAVLINK_MSG_ID_MISSION_ACK;
                        mission_ack.param2 = 500;
                        mission_ack.param3 = 0;
                        mission_ack.param4 = 0;
                        mission_ack.param5 = 0;
                        mission_ack.param6 = 0;
                        mission_ack.param7 = 0;
                        mission_ack.command = 511;
                        mission_ack.target_system = 0;
                        mission_ack.target_component = 0;
                        mission_ack.confirmation = 0;

                        MAVLinkPacket Packetmission_ack = mission_ack.pack();
                        byte[] encodedmission_ack = Packetmission_ack.encodePacket();
                        DatagramPacket mission_ackPacket = new DatagramPacket(encodedmission_ack,
                                encodedmission_ack.length, hostAdd, hostPort);

                        msg_request_data_stream command_ack_req = new msg_request_data_stream();

                        // command_ack_req.msgid =msg_data_stream.MAVLINK_MSG_ID_REQUEST_DATA_STREAM;
                        // command_ack_req.param2 = 10;
                        // command_ack_req.param3 = 0;      
                        // command_ack_req.param4 = 1;
                    
                        // command_ack_req.target_system = 0;
                        // command_ack_req.target_component = 0;
                        command_ack_req.req_message_rate = 1;
                        command_ack_req.target_system = 0; // Target system ID
                        command_ack_req.target_component = 0; // Target component ID
                        command_ack_req.req_stream_id = 0; // Stream ID of the data to request (0 for all streams)
                        command_ack_req.start_stop =1;

                        MAVLinkPacket Packetcommand_ack_req = command_ack_req.pack();
                        byte[] encodedcommand_ack_req = Packetcommand_ack_req.encodePacket();
                        DatagramPacket command_ack_reqPacket = new DatagramPacket(encodedcommand_ack_req,
                            encodedcommand_ack_req.length, hostAdd, hostPort);


                        msg_param_set paramSetMessage = new msg_param_set();
                            paramSetMessage.target_system = 1;  // Set your target system ID
                            paramSetMessage.target_component = 1;  // Set your target component ID
                            paramSetMessage.setParam_Id("EK3_ALT_SOURCE");  // Set the parameter name
                            paramSetMessage.param_value = 0;  // Set the parameter value
                            paramSetMessage.param_type = MAV_PARAM_TYPE.MAV_PARAM_TYPE_REAL32;  // Set the parameter type (e.g., real32 for a float)
                            

                            MAVLinkPacket PacketparamSetMessage = paramSetMessage.pack();
                        byte[] encodedparamSetMessage = PacketparamSetMessage.encodePacket();
                        DatagramPacket paramSetMessagePacket = new DatagramPacket(encodedparamSetMessage,
                        encodedparamSetMessage.length, hostAdd, hostPort);
    

                    // socket.send(mission_ackPacket);
                    // socket.send(stream_global_positionPacket);
                    // socket.send(stream_gps_raw_intPacket);
                        socket.send(heartbeat_msgPacket);
                        socket.send(command_ack_reqPacket);
                        socket.send(paramSetMessagePacket);
                        socket.send(mission_ackPacket);
                        socket.send(stream_global_positionPacket);
                        socket.send(stream_gps_raw_intPacket);
                        
                    }
                    telemReqFlag = 0;

                    while (!Thread.currentThread().isInterrupted() && !stopReceiveUDP) {

                        socket.receive(socketModule.packetReceived());
                        byte[] data = socketModule.packetReceived().getData();
                        lastDataReceivedTime = System.currentTimeMillis(); // Update last data received time
                        isSocketClosed = false; // Socket is receiving data, so it's not closed
                        dronesData.put("con", "1");

                        for (int i = 0; i < data.length; i++) {
                            int receivedInt = data[i] & 0xFF; // Convert the byte to unsigned int

                            MAVLinkPacket mavLinkPacket = mavLinkParser.mavlink_parse_char(receivedInt);

                            if (mavLinkPacket != null) {
                                mavlinkId = mavLinkPacket.msgid;
                                // sysStatus=mavlinkId;
                                switch (mavLinkPacket.msgid) {
                                    case msg_mission_ack.MAVLINK_MSG_ID_MISSION_ACK:
                                        showToastOnUiThread("Mission uploaded");
                                        MisAck = 1;
                                        ackTime = System.currentTimeMillis();
                                        System.out.println("MisAck.............."+MisAck);

                                        // promise.resolve("alt" + relativeAltitude + "vel" + heading + "sat" +
                                        // satellites
                                        // + "lat" + latitude / 1E7 + "lon" + longitude / 1E7 + "hdg" + heading
                                        // + "sys" + sysStatus + "Mod" + Mode+ "ack" + MisAck);
                                        String missionAck_str_val = String.format(" %d", MisAck);
                                        dronesData.put("ack", missionAck_str_val);
                                        // promise.resolve(dronesData);

                                        break;


                                    case msg_heartbeat.MAVLINK_MSG_ID_HEARTBEAT:
                                        msg_heartbeat heartbeatMsg = new msg_heartbeat(mavLinkPacket);
                                        hbtackTime=System.currentTimeMillis();
                                        if (MisAck==1 && hbtackTime-ackTime>1000){

                                            MisAck = 0;
                                            System.out.println("MisAck.............."+MisAck);
                                            String hbt_Ack_str_val = String.format(" %d", MisAck);
                                            dronesData.put("ack", hbt_Ack_str_val);
                                        }

                                        heartbeat = heartbeatMsg.toString();
                                        dronesData.put("Hbt", heartbeat);

                                        Mode = heartbeatMsg.custom_mode;
                                        String mode_str_value = String.format(" %d", Mode);

                                        if (Mode == 4){
                                            dronesData.put("Mod", "Guided");
                                            }
                                        else if  (Mode == 3) { 
                                            dronesData.put("Mod", "Auto");
                                            }
                                        else if  (Mode == 0) { 
                                            dronesData.put("Mod", "Stabilize");
                                            }
                                        else if  (Mode == 9) { 
                                            dronesData.put("Mod", "Land");
                                            }
                                        else if  (Mode == 6) { 
                                            dronesData.put("Mod", "RTL");
                                            }
                                        else if  (Mode == 16) { 
                                            dronesData.put("Mod", "POSHOLD");
                                            }
    
                                        break;

                                    case msg_global_position_int.MAVLINK_MSG_ID_GLOBAL_POSITION_INT:
                                        msg_global_position_int positionMsg = new msg_global_position_int(
                                                mavLinkPacket);
                                        relativeAltitude = positionMsg.relative_alt / 1000.0; // Convert altitude to
                                        absoluteAltitude = positionMsg.alt;
                                        latitude = positionMsg.lat;
                                        longitude = positionMsg.lon;
                                        heading = positionMsg.hdg / 100;
                                        DecimalFormat decimalFormat = new DecimalFormat("#.#");
                                        String formattedRelativeAltitude = decimalFormat.format(relativeAltitude);

                                        String alt_str_value = String.format(" %f", relativeAltitude);
                                        dronesData.put("alt", formattedRelativeAltitude);

                                        String hdg_str_value = String.format(" %f", heading);
                                        dronesData.put("hdg", hdg_str_value);

                                        String lat_str_value = String.format(" %f", latitude / 1E7);
                                        dronesData.put("lat", lat_str_value);

                                        String lon_str_value = String.format(" %f", longitude / 1E7);
                                        dronesData.put("lon", lon_str_value);

                                        // promise.resolve(dronesData);
                                        break;
                                    case msg_gps_raw_int.MAVLINK_MSG_ID_GPS_RAW_INT:
                                        msg_gps_raw_int gpsRawIntMsg = new msg_gps_raw_int(mavLinkPacket);
                                        satellites = gpsRawIntMsg.satellites_visible;
                                        velocity = gpsRawIntMsg.vel / 100;

                                        String vel_str_value = String.format(" %f", velocity);
                                        dronesData.put("vel", vel_str_value);

                                        String sat_str_value = String.format(" %d", satellites);
                                        dronesData.put("sat", sat_str_value);

                                        // promise.resolve(dronesData);
                                        break;

                                    case msg_command_ack.MAVLINK_MSG_ID_COMMAND_ACK:
                                        showToastOnUiThread("command executed");

                                        msg_command_ack command_ack = new msg_command_ack(mavLinkPacket);
                                        // System.out.println("Received acknowledgement: " + command_ack.toString());
                                        
                                        command_ack_value=command_ack.command;
                                        command_ack_result=command_ack.result;
                                        String cmd_ack_value = String.format(" %d", command_ack_value);
                                        dronesData.put("cmd", cmd_ack_value);

                                        // showToastOnUiThread(command_ack.toString());

                                        if (command_ack.command==400 && command_ack.result==4){
                                            showToastOnUiThread("Arm Failed");
                                            dronesData.put("cmd", cmd_ack_value);       
                                         }

                                         else if (command_ack.command==400 && command_ack.result==0){
                                            showToastOnUiThread("Armed");
                                            dronesData.put("cmd", cmd_ack_value);
                                         }
                               
                                        else if (command_ack.command==176 && command_ack.result==9 && Mode==9){
                                            showToastOnUiThread("LAND");
                                            dronesData.put("cmd", cmd_ack_value);
                                         }
                                  
                                        else if (command_ack.command==22 && command_ack.result==0){
                                            showToastOnUiThread("Takeoff accepted");
                                            dronesData.put("cmd", cmd_ack_value);
                                         }
                                        else if (command_ack.command==22 && command_ack.result==4){
                                            showToastOnUiThread("Takeoff Failed");
                                            dronesData.put("cmd", cmd_ack_value);
                                         }

                                    //     // promise.resolve(dronesData);
                                    //     break;
                                    default:
                                        // sysStatus=0;
                                        // promise.resolve("alt" + relativeAltitude + "vel" + heading + "sat" +
                                        // satellites
                                        // + "lat" + latitude / 1E7 + "lon" + longitude / 1E7 + "hdg" + heading
                                        // + "sys" + sysStatus + "Mod" + Mode+ "ack" + MisAck);
                                        // promise.resolve(dronesData);
                                        break;
                                }

                            }
                        }
                    }
                    // try {
                    //     Thread.sleep(100);
                    // } catch (InterruptedException e) {
                    //     Thread.currentThread().interrupt();
                    // }
                      
                } catch (SocketTimeoutException ex) {
                    ex.printStackTrace();
                    promise.reject("TIMEOUT_ERROR", ex.getMessage());
                } catch (IOException ex) {
                    ex.printStackTrace();
                    promise.reject("SERVER_ERROR", ex.getMessage());
                } finally {
                    if (socket != null) {
                        socket.close();
                    }
                }
            }
        });
        udpThread.start();

        Timer disconnectTimer = new Timer();
        disconnectTimer.scheduleAtFixedRate(new TimerTask() {
        @Override
        public void run() {
            if (isSocketClosed) {
                showToastOnUiThread("Socket Disconnected");
                disconnectTimer.cancel(); // Stop the timer once disconnected
            } else if (System.currentTimeMillis() - lastDataReceivedTime > DISCONNECT_TIMEOUT) {
                // showToastOnUiThread("No Data Received - Disconnecting");
                dronesData.put("con", "0");

                Gson gson = new Gson();
                String jsonString = gson.toJson(dronesData);
                promise.resolve(jsonString);
                // showToastOnUiThread("No Data Received - Disconnecting"+jsonString.toString());
                disconnectTimer.cancel(); // Stop the timer on timeout
            }
        }
    }, DISCONNECT_TIMEOUT, DISCONNECT_TIMEOUT);

    Gson gson = new Gson();
    String jsonString = gson.toJson(dronesData);
    promise.resolve(jsonString);
}
}