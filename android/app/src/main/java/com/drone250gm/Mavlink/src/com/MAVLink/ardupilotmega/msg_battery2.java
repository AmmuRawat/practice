        // MESSAGE BATTERY2 PACKING
package com.MAVLink.ardupilotmega;
import com.MAVLink.MAVLinkPacket;
import com.MAVLink.Messages.*;
        //import android.util.Log;
        
        /**
        * 2nd Battery status
        */
        public class msg_battery2 extends MAVLinkMessage{
        
        public static final int MAVLINK_MSG_ID_BATTERY2 = 181;
        public static final int MAVLINK_MSG_LENGTH = 4;
        private static final long serialVersionUID = MAVLINK_MSG_ID_BATTERY2;
        
        
         	/**
        * voltage in millivolts
        */
        public short voltage;
         	/**
        * Battery current, in 10*milliamperes (1 = 10 milliampere), -1: autopilot does not measure the current
        */
        public short current_battery;
        
        
        /**
        * Generates the payload for a mavlink message for a message of this type
        * @return
        */
        public MAVLinkPacket pack(){
		MAVLinkPacket packet = new MAVLinkPacket();
		packet.len = MAVLINK_MSG_LENGTH;
		packet.sysid = 255;
		packet.compid = 190;
		packet.msgid = MAVLINK_MSG_ID_BATTERY2;
        		packet.payload.putShort(voltage);
        		packet.payload.putShort(current_battery);
        
		return packet;
        }
        
        /**
        * Decode a battery2 message into this class fields
        *
        * @param payload The message to decode
        */
        public void unpack(MAVLinkPayload payload) {
        payload.resetIndex();
        	    this.voltage = payload.getShort();
        	    this.current_battery = payload.getShort();
        
        }
        
        /**
        * Constructor for a new message, just initializes the msgid
        */
        public msg_battery2(){
    	msgid = MAVLINK_MSG_ID_BATTERY2;
        }
        
        /**
        * Constructor for a new message, initializes the message with the payload
        * from a mavlink packet
        *
        */
        public msg_battery2(MAVLinkPacket mavLinkPacket){
        this.sysid = mavLinkPacket.sysid;
        this.compid = mavLinkPacket.compid;
        this.msgid = MAVLINK_MSG_ID_BATTERY2;
        unpack(mavLinkPacket.payload);
        //Log.d("MAVLink", "BATTERY2");
        //Log.d("MAVLINK_MSG_ID_BATTERY2", toString());
        }
        
            
        /**
        * Returns a string with the MSG name and data
        */
        public String toString(){
    	return "MAVLINK_MSG_ID_BATTERY2 -"+" voltage:"+voltage+" current_battery:"+current_battery+"";
        }
        }
        