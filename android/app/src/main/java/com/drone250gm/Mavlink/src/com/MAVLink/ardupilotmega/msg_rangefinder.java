        // MESSAGE RANGEFINDER PACKING
package com.MAVLink.ardupilotmega;
import com.MAVLink.MAVLinkPacket;
import com.MAVLink.Messages.*;
        //import android.util.Log;
        
        /**
        * Rangefinder reporting
        */
        public class msg_rangefinder extends MAVLinkMessage{
        
        public static final int MAVLINK_MSG_ID_RANGEFINDER = 173;
        public static final int MAVLINK_MSG_LENGTH = 8;
        private static final long serialVersionUID = MAVLINK_MSG_ID_RANGEFINDER;
        
        
         	/**
        * distance in meters
        */
        public float distance;
         	/**
        * raw voltage if available, zero otherwise
        */
        public float voltage;
        
        
        /**
        * Generates the payload for a mavlink message for a message of this type
        * @return
        */
        public MAVLinkPacket pack(){
		MAVLinkPacket packet = new MAVLinkPacket();
		packet.len = MAVLINK_MSG_LENGTH;
		packet.sysid = 255;
		packet.compid = 190;
		packet.msgid = MAVLINK_MSG_ID_RANGEFINDER;
        		packet.payload.putFloat(distance);
        		packet.payload.putFloat(voltage);
        
		return packet;
        }
        
        /**
        * Decode a rangefinder message into this class fields
        *
        * @param payload The message to decode
        */
        public void unpack(MAVLinkPayload payload) {
        payload.resetIndex();
        	    this.distance = payload.getFloat();
        	    this.voltage = payload.getFloat();
        
        }
        
        /**
        * Constructor for a new message, just initializes the msgid
        */
        public msg_rangefinder(){
    	msgid = MAVLINK_MSG_ID_RANGEFINDER;
        }
        
        /**
        * Constructor for a new message, initializes the message with the payload
        * from a mavlink packet
        *
        */
        public msg_rangefinder(MAVLinkPacket mavLinkPacket){
        this.sysid = mavLinkPacket.sysid;
        this.compid = mavLinkPacket.compid;
        this.msgid = MAVLINK_MSG_ID_RANGEFINDER;
        unpack(mavLinkPacket.payload);
        //Log.d("MAVLink", "RANGEFINDER");
        //Log.d("MAVLINK_MSG_ID_RANGEFINDER", toString());
        }
        
            
        /**
        * Returns a string with the MSG name and data
        */
        public String toString(){
    	return "MAVLINK_MSG_ID_RANGEFINDER -"+" distance:"+distance+" voltage:"+voltage+"";
        }
        }
        