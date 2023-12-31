package com.MAVLink;

import com.MAVLink.ardupilotmega.msg_ahrs;
import com.MAVLink.ardupilotmega.msg_ahrs2;
import com.MAVLink.ardupilotmega.msg_airspeed_autocal;
import com.MAVLink.ardupilotmega.msg_ap_adc;
import com.MAVLink.ardupilotmega.msg_battery2;
import com.MAVLink.ardupilotmega.msg_camera_feedback;
import com.MAVLink.ardupilotmega.msg_camera_status;
import com.MAVLink.ardupilotmega.msg_compassmot_status;
import com.MAVLink.ardupilotmega.msg_data16;
import com.MAVLink.ardupilotmega.msg_data32;
import com.MAVLink.ardupilotmega.msg_data64;
import com.MAVLink.ardupilotmega.msg_data96;
import com.MAVLink.ardupilotmega.msg_digicam_configure;
import com.MAVLink.ardupilotmega.msg_digicam_control;
import com.MAVLink.ardupilotmega.msg_fence_fetch_point;
import com.MAVLink.ardupilotmega.msg_fence_point;
import com.MAVLink.ardupilotmega.msg_fence_status;
import com.MAVLink.ardupilotmega.msg_hwstatus;
import com.MAVLink.ardupilotmega.msg_limits_status;
import com.MAVLink.ardupilotmega.msg_meminfo;
import com.MAVLink.ardupilotmega.msg_mount_configure;
import com.MAVLink.ardupilotmega.msg_mount_control;
import com.MAVLink.ardupilotmega.msg_mount_status;
import com.MAVLink.ardupilotmega.msg_radio;
import com.MAVLink.ardupilotmega.msg_rally_fetch_point;
import com.MAVLink.ardupilotmega.msg_rally_point;
import com.MAVLink.ardupilotmega.msg_rangefinder;
import com.MAVLink.ardupilotmega.msg_sensor_offsets;
import com.MAVLink.ardupilotmega.msg_set_mag_offsets;
import com.MAVLink.ardupilotmega.msg_simstate;
import com.MAVLink.ardupilotmega.msg_wind;
import com.MAVLink.Messages.*;

import com.MAVLink.common.*;


//import Mavlink.src.com.MAVLink.Messages.*;
//import Mavlink.src.com.MAVLink.common.*;
//import Mavlink.src.com.MAVLink.ardupilotmega.*;
//import Mavlink.src.com.MAVLink.ardupilotmega.CRC;
import java.io.Serializable;
        
        /**
        * Common interface for all MAVLink Messages
        * Packet Anatomy
        * This is the anatomy of one packet. It is inspired by the CAN and SAE AS-4 standards.
        
        * Byte Index  Content              Value       Explanation
        * 0            Packet start sign  v1.0: 0xFE   Indicates the start of a new packet.  (v0.9: 0x55)
        * 1            Payload length      0 - 255     Indicates length of the following payload.
        * 2            Packet sequence     0 - 255     Each component counts up his send sequence. Allows to detect packet loss
        * 3            System ID           1 - 255     ID of the SENDING system. Allows to differentiate different MAVs on the same network.
        * 4            Component ID        0 - 255     ID of the SENDING component. Allows to differentiate different components of the same system, e.g. the IMU and the autopilot.
        * 5            Message ID          0 - 255     ID of the message - the id defines what the payload means and how it should be correctly decoded.
        * 6 to (n+6)   Payload             0 - 255     Data of the message, depends on the message id.
        * (n+7)to(n+8) Checksum (low byte, high byte)  ITU X.25/SAE AS-4 hash, excluding packet start sign, so bytes 1..(n+6) Note: The checksum also includes MAVLINK_CRC_EXTRA (Number computed from message fields. Protects the packet from decoding a different version of the same packet but with different variables).
        
        * The checksum is the same as used in ITU X.25 and SAE AS-4 standards (CRC-16-CCITT), documented in SAE AS5669A. Please see the MAVLink source code for a documented C-implementation of it. LINK TO CHECKSUM
        * The minimum packet length is 8 bytes for acknowledgement packets without payload
        * The maximum packet length is 263 bytes for full payload
        *
        */
        public class MAVLinkPacket implements Serializable {
        private static final long serialVersionUID = 2095947771227815314L;
        
        public static final int MAVLINK_STX = 254;
        
        /**
        * Message length. NOT counting STX, LENGTH, SEQ, SYSID, COMPID, MSGID, CRC1 and CRC2
        */
        public int len;
        /**
        * Message sequence
        */
        public int seq;
        /**
        * ID of the SENDING system. Allows to differentiate different MAVs on the
        * same network.
        */
        public int sysid;
        /**
        * ID of the SENDING component. Allows to differentiate different components
        * of the same system, e.g. the IMU and the autopilot.
        */
        public int compid;
        /**
        * ID of the message - the id defines what the payload means and how it
        * should be correctly decoded.
        */
        public int msgid;
        /**
        * Data of the message, depends on the message id.
        */
        public MAVLinkPayload payload;
        /**
        * ITU X.25/SAE AS-4 hash, excluding packet start sign, so bytes 1..(n+6)
        * Note: The checksum also includes MAVLINK_CRC_EXTRA (Number computed from
        * message fields. Protects the packet from decoding a different version of
        * the same packet but with different variables).
        */
        public CRC crc;
        
        public MAVLinkPacket(){
		payload = new MAVLinkPayload();
        }
        
        /**
        * Check if the size of the Payload is equal to the "len" byte
        */
        public boolean payloadIsFilled() {
		if (payload.size() >= MAVLinkPayload.MAX_PAYLOAD_SIZE-1) {
        return true;
		}
		return (payload.size() == len);
        }
        
        /**
        * Update CRC for this packet.
        */
        public void generateCRC(){
		crc = new CRC();
		crc.update_checksum(len);
		crc.update_checksum(seq);
		crc.update_checksum(sysid);
		crc.update_checksum(compid);
		crc.update_checksum(msgid);
		payload.resetIndex();
		for (int i = 0; i < payload.size(); i++) {
        crc.update_checksum(payload.getByte());
		}
		crc.finish_checksum(msgid);
        }
        
        /**
        * Encode this packet for transmission.
        *
        * @return Array with bytes to be transmitted
        */
        public byte[] encodePacket() {
		byte[] buffer = new byte[6 + len + 2];
		int i = 0;
		buffer[i++] = (byte) MAVLINK_STX;
		buffer[i++] = (byte) len;
		buffer[i++] = (byte) seq;
		buffer[i++] = (byte) sysid;
		buffer[i++] = (byte) compid;
		buffer[i++] = (byte) msgid;
		for (int j = 0; j < payload.size(); j++) {
        buffer[i++] = payload.payload.get(j);
		}
		generateCRC();
		buffer[i++] = (byte) (crc.getLSB());
		buffer[i++] = (byte) (crc.getMSB());
		return buffer;
        }
        
        /**
        * Unpack the data in this packet and return a MAVLink message
        *
        * @return MAVLink message decoded from this packet
        */
        public MAVLinkMessage unpack() {
		switch (msgid) {
                    		case msg_sensor_offsets.MAVLINK_MSG_ID_SENSOR_OFFSETS:
			return  new msg_sensor_offsets(this);
            		case msg_set_mag_offsets.MAVLINK_MSG_ID_SET_MAG_OFFSETS:
			return  new msg_set_mag_offsets(this);
            		case msg_meminfo.MAVLINK_MSG_ID_MEMINFO:
			return  new msg_meminfo(this);
            		case msg_ap_adc.MAVLINK_MSG_ID_AP_ADC:
			return  new msg_ap_adc(this);
            		case msg_digicam_configure.MAVLINK_MSG_ID_DIGICAM_CONFIGURE:
			return  new msg_digicam_configure(this);
            		case msg_digicam_control.MAVLINK_MSG_ID_DIGICAM_CONTROL:
			return  new msg_digicam_control(this);
            		case msg_mount_configure.MAVLINK_MSG_ID_MOUNT_CONFIGURE:
			return  new msg_mount_configure(this);
            		case msg_mount_control.MAVLINK_MSG_ID_MOUNT_CONTROL:
			return  new msg_mount_control(this);
            		case msg_mount_status.MAVLINK_MSG_ID_MOUNT_STATUS:
			return  new msg_mount_status(this);
            		case msg_fence_point.MAVLINK_MSG_ID_FENCE_POINT:
			return  new msg_fence_point(this);
            		case msg_fence_fetch_point.MAVLINK_MSG_ID_FENCE_FETCH_POINT:
			return  new msg_fence_fetch_point(this);
            		case msg_fence_status.MAVLINK_MSG_ID_FENCE_STATUS:
			return  new msg_fence_status(this);
            		case msg_ahrs.MAVLINK_MSG_ID_AHRS:
			return  new msg_ahrs(this);
            		case msg_simstate.MAVLINK_MSG_ID_SIMSTATE:
			return  new msg_simstate(this);
            		case msg_hwstatus.MAVLINK_MSG_ID_HWSTATUS:
			return  new msg_hwstatus(this);
            		case msg_radio.MAVLINK_MSG_ID_RADIO:
			return  new msg_radio(this);
            		case msg_limits_status.MAVLINK_MSG_ID_LIMITS_STATUS:
			return  new msg_limits_status(this);
            		case msg_wind.MAVLINK_MSG_ID_WIND:
			return  new msg_wind(this);
            		case msg_data16.MAVLINK_MSG_ID_DATA16:
			return  new msg_data16(this);
            		case msg_data32.MAVLINK_MSG_ID_DATA32:
			return  new msg_data32(this);
            		case msg_data64.MAVLINK_MSG_ID_DATA64:
			return  new msg_data64(this);
            		case msg_data96.MAVLINK_MSG_ID_DATA96:
			return  new msg_data96(this);
            		case msg_rangefinder.MAVLINK_MSG_ID_RANGEFINDER:
			return  new msg_rangefinder(this);
            		case msg_airspeed_autocal.MAVLINK_MSG_ID_AIRSPEED_AUTOCAL:
			return  new msg_airspeed_autocal(this);
            		case msg_rally_point.MAVLINK_MSG_ID_RALLY_POINT:
			return  new msg_rally_point(this);
            		case msg_rally_fetch_point.MAVLINK_MSG_ID_RALLY_FETCH_POINT:
			return  new msg_rally_fetch_point(this);
            		case msg_compassmot_status.MAVLINK_MSG_ID_COMPASSMOT_STATUS:
			return  new msg_compassmot_status(this);
            		case msg_ahrs2.MAVLINK_MSG_ID_AHRS2:
			return  new msg_ahrs2(this);
            		case msg_camera_status.MAVLINK_MSG_ID_CAMERA_STATUS:
			return  new msg_camera_status(this);
            		case msg_camera_feedback.MAVLINK_MSG_ID_CAMERA_FEEDBACK:
			return  new msg_camera_feedback(this);
            		case msg_battery2.MAVLINK_MSG_ID_BATTERY2:
			return  new msg_battery2(this);
            
                        		case msg_heartbeat.MAVLINK_MSG_ID_HEARTBEAT:
			return  new msg_heartbeat(this);
            		case msg_sys_status.MAVLINK_MSG_ID_SYS_STATUS:
			return  new msg_sys_status(this);
            		case msg_system_time.MAVLINK_MSG_ID_SYSTEM_TIME:
			return  new msg_system_time(this);
            		case msg_ping.MAVLINK_MSG_ID_PING:
			return  new msg_ping(this);
            		case msg_change_operator_control.MAVLINK_MSG_ID_CHANGE_OPERATOR_CONTROL:
			return  new msg_change_operator_control(this);
            		case msg_change_operator_control_ack.MAVLINK_MSG_ID_CHANGE_OPERATOR_CONTROL_ACK:
			return  new msg_change_operator_control_ack(this);
            		case msg_auth_key.MAVLINK_MSG_ID_AUTH_KEY:
			return  new msg_auth_key(this);
            		case msg_set_mode.MAVLINK_MSG_ID_SET_MODE:
			return  new msg_set_mode(this);
            		case msg_param_request_read.MAVLINK_MSG_ID_PARAM_REQUEST_READ:
			return  new msg_param_request_read(this);
            		case msg_param_request_list.MAVLINK_MSG_ID_PARAM_REQUEST_LIST:
			return  new msg_param_request_list(this);
            		case msg_param_value.MAVLINK_MSG_ID_PARAM_VALUE:
			return  new msg_param_value(this);
            		case msg_param_set.MAVLINK_MSG_ID_PARAM_SET:
			return  new msg_param_set(this);
            		case msg_gps_raw_int.MAVLINK_MSG_ID_GPS_RAW_INT:
			return  new msg_gps_raw_int(this);
            		case msg_gps_status.MAVLINK_MSG_ID_GPS_STATUS:
			return  new msg_gps_status(this);
            		case msg_scaled_imu.MAVLINK_MSG_ID_SCALED_IMU:
			return  new msg_scaled_imu(this);
            		case msg_raw_imu.MAVLINK_MSG_ID_RAW_IMU:
			return  new msg_raw_imu(this);
            		case msg_raw_pressure.MAVLINK_MSG_ID_RAW_PRESSURE:
			return  new msg_raw_pressure(this);
            		case msg_scaled_pressure.MAVLINK_MSG_ID_SCALED_PRESSURE:
			return  new msg_scaled_pressure(this);
            		case msg_attitude.MAVLINK_MSG_ID_ATTITUDE:
			return  new msg_attitude(this);
            		case msg_attitude_quaternion.MAVLINK_MSG_ID_ATTITUDE_QUATERNION:
			return  new msg_attitude_quaternion(this);
            		case msg_local_position_ned.MAVLINK_MSG_ID_LOCAL_POSITION_NED:
			return  new msg_local_position_ned(this);
            		case msg_global_position_int.MAVLINK_MSG_ID_GLOBAL_POSITION_INT:
			return  new msg_global_position_int(this);
            		case msg_rc_channels_scaled.MAVLINK_MSG_ID_RC_CHANNELS_SCALED:
			return  new msg_rc_channels_scaled(this);
            		case msg_rc_channels_raw.MAVLINK_MSG_ID_RC_CHANNELS_RAW:
			return  new msg_rc_channels_raw(this);
            		case msg_servo_output_raw.MAVLINK_MSG_ID_SERVO_OUTPUT_RAW:
			return  new msg_servo_output_raw(this);
            		case msg_mission_request_partial_list.MAVLINK_MSG_ID_MISSION_REQUEST_PARTIAL_LIST:
			return  new msg_mission_request_partial_list(this);
            		case msg_mission_write_partial_list.MAVLINK_MSG_ID_MISSION_WRITE_PARTIAL_LIST:
			return  new msg_mission_write_partial_list(this);
            		case msg_mission_item.MAVLINK_MSG_ID_MISSION_ITEM:
			return  new msg_mission_item(this);
            		case msg_mission_request.MAVLINK_MSG_ID_MISSION_REQUEST:
			return  new msg_mission_request(this);
            		case msg_mission_set_current.MAVLINK_MSG_ID_MISSION_SET_CURRENT:
			return  new msg_mission_set_current(this);
            		case msg_mission_current.MAVLINK_MSG_ID_MISSION_CURRENT:
			return  new msg_mission_current(this);
            		case msg_mission_request_list.MAVLINK_MSG_ID_MISSION_REQUEST_LIST:
			return  new msg_mission_request_list(this);
            		case msg_mission_count.MAVLINK_MSG_ID_MISSION_COUNT:
			return  new msg_mission_count(this);
            		case msg_mission_clear_all.MAVLINK_MSG_ID_MISSION_CLEAR_ALL:
			return  new msg_mission_clear_all(this);
            		case msg_mission_item_reached.MAVLINK_MSG_ID_MISSION_ITEM_REACHED:
			return  new msg_mission_item_reached(this);
            		case msg_mission_ack.MAVLINK_MSG_ID_MISSION_ACK:
			return  new msg_mission_ack(this);
            		case msg_set_gps_global_origin.MAVLINK_MSG_ID_SET_GPS_GLOBAL_ORIGIN:
			return  new msg_set_gps_global_origin(this);
            		case msg_gps_global_origin.MAVLINK_MSG_ID_GPS_GLOBAL_ORIGIN:
			return  new msg_gps_global_origin(this);
            		case msg_safety_set_allowed_area.MAVLINK_MSG_ID_SAFETY_SET_ALLOWED_AREA:
			return  new msg_safety_set_allowed_area(this);
            		case msg_safety_allowed_area.MAVLINK_MSG_ID_SAFETY_ALLOWED_AREA:
			return  new msg_safety_allowed_area(this);
            		case msg_attitude_quaternion_cov.MAVLINK_MSG_ID_ATTITUDE_QUATERNION_COV:
			return  new msg_attitude_quaternion_cov(this);
            		case msg_nav_controller_output.MAVLINK_MSG_ID_NAV_CONTROLLER_OUTPUT:
			return  new msg_nav_controller_output(this);
            		case msg_global_position_int_cov.MAVLINK_MSG_ID_GLOBAL_POSITION_INT_COV:
			return  new msg_global_position_int_cov(this);
            		case msg_local_position_ned_cov.MAVLINK_MSG_ID_LOCAL_POSITION_NED_COV:
			return  new msg_local_position_ned_cov(this);
            		case msg_rc_channels.MAVLINK_MSG_ID_RC_CHANNELS:
			return  new msg_rc_channels(this);
            		case msg_request_data_stream.MAVLINK_MSG_ID_REQUEST_DATA_STREAM:
			return  new msg_request_data_stream(this);
            		case msg_data_stream.MAVLINK_MSG_ID_DATA_STREAM:
			return  new msg_data_stream(this);
            		case msg_manual_control.MAVLINK_MSG_ID_MANUAL_CONTROL:
			return  new msg_manual_control(this);
            		case msg_rc_channels_override.MAVLINK_MSG_ID_RC_CHANNELS_OVERRIDE:
			return  new msg_rc_channels_override(this);
            		case msg_mission_item_int.MAVLINK_MSG_ID_MISSION_ITEM_INT:
			return  new msg_mission_item_int(this);
            		case msg_vfr_hud.MAVLINK_MSG_ID_VFR_HUD:
			return  new msg_vfr_hud(this);
            		case msg_command_int.MAVLINK_MSG_ID_COMMAND_INT:
			return  new msg_command_int(this);
            		case msg_command_long.MAVLINK_MSG_ID_COMMAND_LONG:
			return  new msg_command_long(this);
            		case msg_command_ack.MAVLINK_MSG_ID_COMMAND_ACK:
			return  new msg_command_ack(this);
            		case msg_manual_setpoint.MAVLINK_MSG_ID_MANUAL_SETPOINT:
			return  new msg_manual_setpoint(this);
            		case msg_set_attitude_target.MAVLINK_MSG_ID_SET_ATTITUDE_TARGET:
			return  new msg_set_attitude_target(this);
            		case msg_attitude_target.MAVLINK_MSG_ID_ATTITUDE_TARGET:
			return  new msg_attitude_target(this);
            		case msg_set_position_target_local_ned.MAVLINK_MSG_ID_SET_POSITION_TARGET_LOCAL_NED:
			return  new msg_set_position_target_local_ned(this);
            		case msg_position_target_local_ned.MAVLINK_MSG_ID_POSITION_TARGET_LOCAL_NED:
			return  new msg_position_target_local_ned(this);
            		case msg_set_position_target_global_int.MAVLINK_MSG_ID_SET_POSITION_TARGET_GLOBAL_INT:
			return  new msg_set_position_target_global_int(this);
            		case msg_position_target_global_int.MAVLINK_MSG_ID_POSITION_TARGET_GLOBAL_INT:
			return  new msg_position_target_global_int(this);
            		case msg_local_position_ned_system_global_offset.MAVLINK_MSG_ID_LOCAL_POSITION_NED_SYSTEM_GLOBAL_OFFSET:
			return  new msg_local_position_ned_system_global_offset(this);
            		case msg_hil_state.MAVLINK_MSG_ID_HIL_STATE:
			return  new msg_hil_state(this);
            		case msg_hil_controls.MAVLINK_MSG_ID_HIL_CONTROLS:
			return  new msg_hil_controls(this);
            		case msg_hil_rc_inputs_raw.MAVLINK_MSG_ID_HIL_RC_INPUTS_RAW:
			return  new msg_hil_rc_inputs_raw(this);
            		case msg_optical_flow.MAVLINK_MSG_ID_OPTICAL_FLOW:
			return  new msg_optical_flow(this);
            		case msg_global_vision_position_estimate.MAVLINK_MSG_ID_GLOBAL_VISION_POSITION_ESTIMATE:
			return  new msg_global_vision_position_estimate(this);
            		case msg_vision_position_estimate.MAVLINK_MSG_ID_VISION_POSITION_ESTIMATE:
			return  new msg_vision_position_estimate(this);
            		case msg_vision_speed_estimate.MAVLINK_MSG_ID_VISION_SPEED_ESTIMATE:
			return  new msg_vision_speed_estimate(this);
            		case msg_vicon_position_estimate.MAVLINK_MSG_ID_VICON_POSITION_ESTIMATE:
			return  new msg_vicon_position_estimate(this);
            		case msg_highres_imu.MAVLINK_MSG_ID_HIGHRES_IMU:
			return  new msg_highres_imu(this);
            		case msg_optical_flow_rad.MAVLINK_MSG_ID_OPTICAL_FLOW_RAD:
			return  new msg_optical_flow_rad(this);
            		case msg_hil_sensor.MAVLINK_MSG_ID_HIL_SENSOR:
			return  new msg_hil_sensor(this);
            		case msg_sim_state.MAVLINK_MSG_ID_SIM_STATE:
			return  new msg_sim_state(this);
            		case msg_radio_status.MAVLINK_MSG_ID_RADIO_STATUS:
			return  new msg_radio_status(this);
            		case msg_file_transfer_protocol.MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL:
			return  new msg_file_transfer_protocol(this);
            		case msg_timesync.MAVLINK_MSG_ID_TIMESYNC:
			return  new msg_timesync(this);
            		case msg_hil_gps.MAVLINK_MSG_ID_HIL_GPS:
			return  new msg_hil_gps(this);
            		case msg_hil_optical_flow.MAVLINK_MSG_ID_HIL_OPTICAL_FLOW:
			return  new msg_hil_optical_flow(this);
            		case msg_hil_state_quaternion.MAVLINK_MSG_ID_HIL_STATE_QUATERNION:
			return  new msg_hil_state_quaternion(this);
            		case msg_scaled_imu2.MAVLINK_MSG_ID_SCALED_IMU2:
			return  new msg_scaled_imu2(this);
            		case msg_log_request_list.MAVLINK_MSG_ID_LOG_REQUEST_LIST:
			return  new msg_log_request_list(this);
            		case msg_log_entry.MAVLINK_MSG_ID_LOG_ENTRY:
			return  new msg_log_entry(this);
            		case msg_log_request_data.MAVLINK_MSG_ID_LOG_REQUEST_DATA:
			return  new msg_log_request_data(this);
            		case msg_log_data.MAVLINK_MSG_ID_LOG_DATA:
			return  new msg_log_data(this);
            		case msg_log_erase.MAVLINK_MSG_ID_LOG_ERASE:
			return  new msg_log_erase(this);
            		case msg_log_request_end.MAVLINK_MSG_ID_LOG_REQUEST_END:
			return  new msg_log_request_end(this);
            		case msg_gps_inject_data.MAVLINK_MSG_ID_GPS_INJECT_DATA:
			return  new msg_gps_inject_data(this);
            		case msg_gps2_raw.MAVLINK_MSG_ID_GPS2_RAW:
			return  new msg_gps2_raw(this);
            		case msg_power_status.MAVLINK_MSG_ID_POWER_STATUS:
			return  new msg_power_status(this);
            		case msg_serial_control.MAVLINK_MSG_ID_SERIAL_CONTROL:
			return  new msg_serial_control(this);
            		case msg_gps_rtk.MAVLINK_MSG_ID_GPS_RTK:
			return  new msg_gps_rtk(this);
            		case msg_gps2_rtk.MAVLINK_MSG_ID_GPS2_RTK:
			return  new msg_gps2_rtk(this);
            		case msg_data_transmission_handshake.MAVLINK_MSG_ID_DATA_TRANSMISSION_HANDSHAKE:
			return  new msg_data_transmission_handshake(this);
            		case msg_encapsulated_data.MAVLINK_MSG_ID_ENCAPSULATED_DATA:
			return  new msg_encapsulated_data(this);
            		case msg_distance_sensor.MAVLINK_MSG_ID_DISTANCE_SENSOR:
			return  new msg_distance_sensor(this);
            		case msg_terrain_request.MAVLINK_MSG_ID_TERRAIN_REQUEST:
			return  new msg_terrain_request(this);
            		case msg_terrain_data.MAVLINK_MSG_ID_TERRAIN_DATA:
			return  new msg_terrain_data(this);
            		case msg_terrain_check.MAVLINK_MSG_ID_TERRAIN_CHECK:
			return  new msg_terrain_check(this);
            		case msg_terrain_report.MAVLINK_MSG_ID_TERRAIN_REPORT:
			return  new msg_terrain_report(this);
            		case msg_battery_status.MAVLINK_MSG_ID_BATTERY_STATUS:
			return  new msg_battery_status(this);
            		case msg_autopilot_version.MAVLINK_MSG_ID_AUTOPILOT_VERSION:
			return  new msg_autopilot_version(this);
            		case msg_v2_extension.MAVLINK_MSG_ID_V2_EXTENSION:
			return  new msg_v2_extension(this);
            		case msg_memory_vect.MAVLINK_MSG_ID_MEMORY_VECT:
			return  new msg_memory_vect(this);
            		case msg_debug_vect.MAVLINK_MSG_ID_DEBUG_VECT:
			return  new msg_debug_vect(this);
            		case msg_named_value_float.MAVLINK_MSG_ID_NAMED_VALUE_FLOAT:
			return  new msg_named_value_float(this);
            		case msg_named_value_int.MAVLINK_MSG_ID_NAMED_VALUE_INT:
			return  new msg_named_value_int(this);
            		case msg_statustext.MAVLINK_MSG_ID_STATUSTEXT:
			return  new msg_statustext(this);
            		case msg_debug.MAVLINK_MSG_ID_DEBUG:
			return  new msg_debug(this);
            
            		default:
        return null;
		}
        }
        
        }
        
        