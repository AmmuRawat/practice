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

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketTimeoutException;
import java.net.SocketException;

import java.util.ArrayList;
import java.util.List;
import java.net.InetAddress;

import com.MAVLink.MAVLinkPacket;
import com.MAVLink.Parser;
import com.MAVLink.common.*;
import com.MAVLink.enums.*;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.drone250gm.socketModule.*;

// import src.org.freedesktop.gstreamer.Gst;

public class MavlinkCommand extends ReactContextBaseJavaModule {
    private Handler uiHandler;
    private Handler handler;

    public MavlinkCommand(ReactApplicationContext reactContext) {
        super(reactContext);
        handler = new Handler(Looper.getMainLooper());
        uiHandler = new Handler(Looper.getMainLooper()); 
    }

    @Override
    public String getName() {
        return "MavlinkCommand";
    }

    
    @ReactMethod
	public static void sendAutoMessage() {
        try {
            msg_command_long GuidedModeMsg = new msg_command_long();

            GuidedModeMsg.param1 = 1;
            GuidedModeMsg.param2 = 4;
            GuidedModeMsg.param3 = 0;
            GuidedModeMsg.param4 = 0;
            GuidedModeMsg.param5 = 0;
            GuidedModeMsg.param6 = 0;
            GuidedModeMsg.param7 = 0;
            GuidedModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
            GuidedModeMsg.target_system = 0;
            GuidedModeMsg.target_component = 0;
            GuidedModeMsg.confirmation = 0;

            MAVLinkPacket PacketGuidedModeMsg = GuidedModeMsg.pack();
            byte[] encodedGuidedModeMsg = PacketGuidedModeMsg.encodePacket();
            DatagramPacket guidedPacket = new DatagramPacket(encodedGuidedModeMsg, encodedGuidedModeMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(guidedPacket);

            msg_command_long AutoModeMsg = new msg_command_long();

            AutoModeMsg.param1 = 1;
            AutoModeMsg.param2 = 3;
            AutoModeMsg.param3 = 0;
            AutoModeMsg.param4 = 0;
            AutoModeMsg.param5 = 0;
            AutoModeMsg.param6 = 0;
            AutoModeMsg.param7 = 0;
            AutoModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
            AutoModeMsg.target_system = 0;
            AutoModeMsg.target_component = 0;
            AutoModeMsg.confirmation = 0;

            MAVLinkPacket PacketAutoModeMsg = AutoModeMsg.pack();
            byte[] encodedAutoModeMsg = PacketAutoModeMsg.encodePacket();
            DatagramPacket autoPacket = new DatagramPacket(encodedAutoModeMsg, encodedAutoModeMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(autoPacket);

        } catch (Exception e) {
            e.printStackTrace();
        }}
        

        @ReactMethod
        public static void sendRtlMessage() {
            try {
    
                msg_command_long RtlModeMsg = new msg_command_long();
    
                RtlModeMsg.param1 = 1;
                RtlModeMsg.param2 = 6;
                RtlModeMsg.param3 = 0;
                RtlModeMsg.param4 = 0;
                RtlModeMsg.param5 = 0;
                RtlModeMsg.param6 = 0;
                RtlModeMsg.param7 = 0;
                RtlModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
                RtlModeMsg.target_system = 0;
                RtlModeMsg.target_component = 0;
                RtlModeMsg.confirmation = 0;
    
                MAVLinkPacket PacketRtlModeMsg = RtlModeMsg.pack();
                byte[] encodedRtlModeMsg = PacketRtlModeMsg.encodePacket();
                DatagramPacket rtlPacket = new DatagramPacket(encodedRtlModeMsg, encodedRtlModeMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
                socketModule.send(rtlPacket);
    
            } catch (Exception e) {
                e.printStackTrace();
            }}
    
    @ReactMethod
	public static void sendArmMessage() {
        try {

            msg_command_long GuidedModeMsg = new msg_command_long();

            GuidedModeMsg.param1 = 1;
            GuidedModeMsg.param2 = 4;
            GuidedModeMsg.param3 = 0;
            GuidedModeMsg.param4 = 0;
            GuidedModeMsg.param5 = 0;
            GuidedModeMsg.param6 = 0;
            GuidedModeMsg.param7 = 0;
            GuidedModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
            GuidedModeMsg.target_system = 0;
            GuidedModeMsg.target_component = 0;
            GuidedModeMsg.confirmation = 0;

            MAVLinkPacket PacketGuidedModeMsg = GuidedModeMsg.pack();
            byte[] encodedGuidedModeMsg = PacketGuidedModeMsg.encodePacket();
            DatagramPacket guidedPacket = new DatagramPacket(encodedGuidedModeMsg, encodedGuidedModeMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(guidedPacket);

            // Thread.sleep(500);

            msg_command_long setArmMsg =new msg_command_long();
            setArmMsg.param1 = 1;
            setArmMsg.param2 = 1;
            setArmMsg.param3 = 0;
            setArmMsg.param4 = 0;
            setArmMsg.param5 = 0;
            setArmMsg.param6 = 0;
            setArmMsg.param7 = 0;
            setArmMsg.command = 400;
            setArmMsg.target_system = 0;
            setArmMsg.target_component = 0;
            setArmMsg.confirmation = 0;

            MAVLinkPacket PacketsetArmMsg = setArmMsg.pack();
            byte[] encodedsetArmMsg = PacketsetArmMsg.encodePacket();
            DatagramPacket armPacket = new DatagramPacket(encodedsetArmMsg, encodedsetArmMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(armPacket);
    
        } catch (Exception e) {
        e.printStackTrace();
    }}

    @ReactMethod
	public static void sendLandMessage() {
        try {

            msg_command_long LandModeMsg = new msg_command_long();
            LandModeMsg.param1 = 1;
            LandModeMsg.param2 = 9; //comnmand land 
            LandModeMsg.param3 = 0;
            LandModeMsg.param4 = 0;
            LandModeMsg.param5 = 0;
            LandModeMsg.param6 = 0;
            LandModeMsg.param7 = 0;
            LandModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
            LandModeMsg.target_system = 0;
            LandModeMsg.target_component = 0;
            LandModeMsg.confirmation = 0;

            MAVLinkPacket PacketLandModeMsg= LandModeMsg.pack();
            byte[] encodedLandModeMsg = PacketLandModeMsg.encodePacket();
            DatagramPacket LandModeMsgPacket = new DatagramPacket(encodedLandModeMsg, encodedLandModeMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(LandModeMsgPacket);

    
        } catch (Exception e) {
        e.printStackTrace();
    }}

    @ReactMethod
	public static void sendTakeoffMessage() {
        try {

            msg_command_long TakeoffMsg = new msg_command_long();
            TakeoffMsg.param1 = 0;
            TakeoffMsg.param2 = 0;
            TakeoffMsg.param3 = 0;
            TakeoffMsg.param4 = 0;
            TakeoffMsg.param5 = 0;
            TakeoffMsg.param6 = 0;
            TakeoffMsg.param7 =  5; //takeoff height
            TakeoffMsg.command = MAV_CMD.MAV_CMD_NAV_TAKEOFF;
            TakeoffMsg.target_system = 0;
            TakeoffMsg.target_component = 0;
            TakeoffMsg.confirmation = 0;

            MAVLinkPacket PacketTakeoffMsg= TakeoffMsg.pack();
            byte[] encodedTakeoffMsg = PacketTakeoffMsg.encodePacket();
            DatagramPacket TakeoffMsgPacket = new DatagramPacket(encodedTakeoffMsg, encodedTakeoffMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(TakeoffMsgPacket);

        } catch (Exception e) {
        e.printStackTrace();
    }}


    @ReactMethod
    public void sendNextPosMessage(double Lat ,double Lon ,int speed,float alt) throws IOException{
    
        try {
            msg_mission_item nextPos = new msg_mission_item();
            nextPos.seq = 0;
            nextPos.current = 2; // TODO use guided mode enum
            nextPos.frame = MAV_FRAME.MAV_FRAME_GLOBAL_RELATIVE_ALT;
            nextPos.command = MAV_CMD.MAV_CMD_NAV_WAYPOINT; //
            nextPos.param1 = 0; // TODO use correct parameter
            nextPos.param2 = 0; // TODO use correct parameter
            nextPos.param3 = 0; // TODO use correct parameter
            nextPos.param4 = 0; // TODO use correct parameter
            nextPos.x = (float) Lat;
            nextPos.y = (float) Lon;
            nextPos.z = (float) alt;
            nextPos.autocontinue = 1; // TODO use correct parameter
            nextPos.target_system = 0;
            nextPos.target_component = 0;
    
            MAVLinkPacket PacketnextPos= nextPos.pack();
            byte[] encodednextPos = PacketnextPos.encodePacket();
            DatagramPacket nextPosPacket = new DatagramPacket(encodednextPos, encodednextPos.length,socketModule.hostAddIP(),socketModule.hostPortIP());
            socketModule.send(nextPosPacket);

            sendSpeedChangeMessage(speed);
    
            } catch (Exception e) {
            e.printStackTrace();
        }}
    
    @ReactMethod
    public void sendSpeedChangeMessage(int speed) throws IOException{
    
        try {
            msg_command_long changeSpeedMsg = new msg_command_long(); 
            changeSpeedMsg.param1 = 1;
            changeSpeedMsg.param2 = speed;
            changeSpeedMsg.param3 = 0;
            changeSpeedMsg.param4 = 0;
            changeSpeedMsg.param5 = 0;
            changeSpeedMsg.param6 = 0;
            changeSpeedMsg.param7 = 0;
            changeSpeedMsg.command = MAV_CMD.MAV_CMD_DO_CHANGE_SPEED;
            changeSpeedMsg.target_system = 0;
            changeSpeedMsg.target_component = 0;
            changeSpeedMsg.confirmation = 0;

            MAVLinkPacket PacketchangeSpeedMsg = changeSpeedMsg.pack();
            byte[] encodedchangeSpeedMsg = PacketchangeSpeedMsg.encodePacket();
            DatagramPacket changeSpeedMsgPacket = new DatagramPacket(encodedchangeSpeedMsg, encodedchangeSpeedMsg.length,socketModule.hostAddIP(), socketModule.hostPortIP());
            socketModule.send(changeSpeedMsgPacket);
    
            } catch (Exception e) {
            e.printStackTrace();
        }}

}