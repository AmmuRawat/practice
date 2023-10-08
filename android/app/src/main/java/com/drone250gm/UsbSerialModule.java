package com.drone250gm;

import android.content.Context;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialPort;
import com.hoho.android.usbserial.driver.UsbSerialProber;
import com.hoho.android.usbserial.util.SerialInputOutputManager;
import android.widget.Toast;
import java.nio.charset.StandardCharsets;

import com.MAVLink.common.*;
import com.MAVLink.enums.*;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.Executors;

public class UsbSerialModule extends ReactContextBaseJavaModule implements SerialInputOutputManager.Listener {
private static ReactApplicationContext reactContext;
private static final int WRITE_WAIT_MILLIS = 2000;  // 2 seconds
private SerialInputOutputManager usbIoManager;
private UsbSerialPort serialPort;

    UsbSerialModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "UsbSerialModule";
    }

    @ReactMethod
    public void setupUsbConnection() {
        // Toast.makeText(getReactApplicationContext(), "setupUsbConnection start", Toast.LENGTH_SHORT).show();

        UsbManager manager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
        // Toast.makeText(getReactApplicationContext(),manager.toString(), Toast.LENGTH_SHORT).show();

        List<UsbSerialDriver> availableDrivers = UsbSerialProber.getDefaultProber().findAllDrivers(manager);
        if (availableDrivers.isEmpty()) {
            // Toast.makeText(getReactApplicationContext(),"availableDrivers.isEmpty()", Toast.LENGTH_SHORT).show();

            return;
        }

        UsbSerialDriver driver = availableDrivers.get(0);
        UsbDeviceConnection connection = manager.openDevice(driver.getDevice());
        if (connection == null) {


            // Add UsbManager.requestPermission(driver.getDevice(), ..) handling here
            return;
        }

        UsbSerialPort port = driver.getPorts().get(0); // Most devices have just one port (port 0)
        try {
            port.open(connection);
            
            // port.setParameters(19200, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);
            port.setParameters(115200, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);

            serialPort = port;

            usbIoManager = new SerialInputOutputManager(serialPort, this);
            Executors.newSingleThreadExecutor().submit(usbIoManager);

                if (usbIoManager != null ) {
                    // Toast.makeText(getReactApplicationContext(), "usbIoManager is not null", Toast.LENGTH_SHORT).show();

                        if (connection != null) {
                            // Toast.makeText(getReactApplicationContext(), "connection is not null", Toast.LENGTH_SHORT).show();
                            }
                            if(serialPort != null){
                                Toast.makeText(getReactApplicationContext(), "mavlnk start", Toast.LENGTH_SHORT).show(); 
                                msg_command_long setModeMsg =new msg_command_long();
                                setModeMsg.param1 = 1;
                                setModeMsg.param2 = 4;
                                setModeMsg.param3 = 0;
                                setModeMsg.param4 = 0;
                                setModeMsg.param5 = 0;
                                setModeMsg.param6 = 0;
                                setModeMsg.param7 = 0;
                                setModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
                                setModeMsg.target_system = 0;
                                setModeMsg.target_component = 0;
                                setModeMsg.confirmation = 0;
                                
                                byte[] encodedMsg = setModeMsg.pack().encodePacket();
                                // Toast.makeText(getReactApplicationContext(), "serial is not null", Toast.LENGTH_SHORT).show();
                                serialPort.write(encodedMsg, WRITE_WAIT_MILLIS);
                                // String toastMsg = encodedMsg + "";
                                Toast.makeText(getReactApplicationContext(), "guided", Toast.LENGTH_SHORT).show();


                            }
                }

        } catch (IOException e) {
            // handle the exception
            // Toast.makeText(getReactApplicationContext(), "bytes:"+e, Toast.LENGTH_SHORT).show();

            e.printStackTrace();
            }           
            // Toast.makeText(getReactApplicationContext(),"setupUsbConnection ends", Toast.LENGTH_SHORT).show();
        }

        @ReactMethod
        public void javaArm() {
            UsbManager manager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
            List<UsbSerialDriver> availableDrivers = UsbSerialProber.getDefaultProber().findAllDrivers(manager);
            if (availableDrivers.isEmpty()) {
            }

        UsbSerialDriver driver = availableDrivers.get(0);
        UsbDeviceConnection connection = manager.openDevice(driver.getDevice());
        if (connection == null) {
            return;
        }
        UsbSerialPort port = driver.getPorts().get(0); // Most devices have just one port (port 0)

        try {
            port.open(connection);
            port.setParameters(115200, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);

            serialPort = port;

            usbIoManager = new SerialInputOutputManager(serialPort, this);
            Executors.newSingleThreadExecutor().submit(usbIoManager);

                if (usbIoManager != null ) {
                        if (connection != null) {
                            }
                            if(serialPort != null){
                                msg_command_long setModeMsg =new msg_command_long();
                                setModeMsg.param1 = 1;
                                setModeMsg.param2 = 4;
                                setModeMsg.param3 = 0;
                                setModeMsg.param4 = 0;
                                setModeMsg.param5 = 0;
                                setModeMsg.param6 = 0;
                                setModeMsg.param7 = 0;
                                setModeMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
                                setModeMsg.target_system = 0;
                                setModeMsg.target_component = 0;
                                setModeMsg.confirmation = 0;
                                
                                byte[] encodedMsg = setModeMsg.pack().encodePacket();
                                // Toast.makeText(getReactApplicationContext(), "serial is not null", Toast.LENGTH_SHORT).show();
                                serialPort.write(encodedMsg, WRITE_WAIT_MILLIS);
                                // String toastMsg = encodedMsg + "";
                                Toast.makeText(getReactApplicationContext(), "guided", Toast.LENGTH_SHORT).show();


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
    
                                byte[] encodedArmMsg = setArmMsg.pack().encodePacket();
                                serialPort.write(encodedArmMsg, WRITE_WAIT_MILLIS);
                                Toast.makeText(getReactApplicationContext(), "arm", Toast.LENGTH_SHORT).show();


                        }
            
                    }
    
            } catch (IOException e) {

                e.printStackTrace();
            }           
        }
 
        @ReactMethod
        public void javaTakeoff() {
            UsbManager manager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
            List<UsbSerialDriver> availableDrivers = UsbSerialProber.getDefaultProber().findAllDrivers(manager);
            if (availableDrivers.isEmpty()) {
            }

        UsbSerialDriver driver = availableDrivers.get(0);
        UsbDeviceConnection connection = manager.openDevice(driver.getDevice());
        if (connection == null) {
            return;
        }
        UsbSerialPort port = driver.getPorts().get(0); // Most devices have just one port (port 0)

        try {
            port.open(connection);
            port.setParameters(115200, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);

            serialPort = port;

            usbIoManager = new SerialInputOutputManager(serialPort, this);
            Executors.newSingleThreadExecutor().submit(usbIoManager);

                if (usbIoManager != null ) {
                        if (connection != null) {
                            }
                            if(serialPort != null){

                                msg_command_long takeoffMsg =new msg_command_long();
	            
                                takeoffMsg.param1 = 0;
                                takeoffMsg.param2 = 0;
                                takeoffMsg.param3 = 0;
                                takeoffMsg.param4 = 0;
                                takeoffMsg.param5 = 0;
                                takeoffMsg.param6 = 0;
                                takeoffMsg.param7 = 10; //takeoff height
                                takeoffMsg.command = MAV_CMD.MAV_CMD_NAV_TAKEOFF;
                                takeoffMsg.target_system = 0;
                                takeoffMsg.target_component = 0;
                                takeoffMsg.confirmation = 0;
                                
                
                            byte[] encodedTakeoffMsg = takeoffMsg.pack().encodePacket();
                            serialPort.write(encodedTakeoffMsg, WRITE_WAIT_MILLIS);
                            Toast.makeText(getReactApplicationContext(), "takeoff", Toast.LENGTH_SHORT).show();
    
                        }
            
                    }
    
            } catch (IOException e) {

                e.printStackTrace();
            }           
        }



        @ReactMethod
        public void javaLand() {
            UsbManager manager = (UsbManager) reactContext.getSystemService(Context.USB_SERVICE);
            List<UsbSerialDriver> availableDrivers = UsbSerialProber.getDefaultProber().findAllDrivers(manager);
            if (availableDrivers.isEmpty()) {
            }

        UsbSerialDriver driver = availableDrivers.get(0);
        UsbDeviceConnection connection = manager.openDevice(driver.getDevice());
        if (connection == null) {
            return;
        }
        UsbSerialPort port = driver.getPorts().get(0); // Most devices have just one port (port 0)

        try {
            port.open(connection);
            port.setParameters(115200, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);

            serialPort = port;

            usbIoManager = new SerialInputOutputManager(serialPort, this);
            Executors.newSingleThreadExecutor().submit(usbIoManager);

                if (usbIoManager != null ) {
                        if (connection != null) {
                            }
                            if(serialPort != null){

                                msg_command_long setLandMsg =new msg_command_long();
                                setLandMsg.param1 = 1;
                                setLandMsg.param2 = 9;
                                setLandMsg.param3 = 0;
                                setLandMsg.param4 = 0;
                                setLandMsg.param5 = 0;
                                setLandMsg.param6 = 0;
                                setLandMsg.param7 = 0;
                                setLandMsg.command = MAV_CMD.MAV_CMD_DO_SET_MODE;
                                setLandMsg.target_system = 0;
                                setLandMsg.target_component = 0;
                                setLandMsg.confirmation = 0;
                                
                                byte[] encodedLandMsg = setLandMsg.pack().encodePacket();
                                // Toast.makeText(getReactApplicationContext(), "serial is not null", Toast.LENGTH_SHORT).show();
                                serialPort.write(encodedLandMsg, WRITE_WAIT_MILLIS);
                                // String toastMsg = encodedMsg + "";
                                Toast.makeText(getReactApplicationContext(), "Land", Toast.LENGTH_SHORT).show();

    
                        }
            
                    }
    
            } catch (IOException e) {

                e.printStackTrace();
            }           
        }




        @ReactMethod
        void write(byte[] data) throws IOException {
            if(serialPort == null)
                throw new IOException("not connected");
            serialPort.write(data, WRITE_WAIT_MILLIS);
            Toast.makeText(getReactApplicationContext(), "bytes:"+data, Toast.LENGTH_SHORT).show();
        }

        @ReactMethod
        public void writeData(String data) {
            Toast.makeText(getReactApplicationContext(), data, Toast.LENGTH_SHORT).show();
            usbIoManager.writeAsync(data.getBytes());
            Toast.makeText(getReactApplicationContext(), "not null outside", Toast.LENGTH_SHORT).show();

            if (usbIoManager == null) {
                usbIoManager.writeAsync(data.getBytes());
                Toast.makeText(getReactApplicationContext(), "not null", Toast.LENGTH_SHORT).show();
            }
        }

    
        
        @Override
        public void onRunError(Exception e) {
        // Handle the error
        e.printStackTrace();
    }


        @Override
        public void onNewData(byte[] data) {
            // Handle the received data
            // You might need to use an event to send this data back to the JS side
        }



        @ReactMethod
        public void closeConnection() {
            if (usbIoManager != null) {
                usbIoManager.stop();
                usbIoManager = null;
            }
        }
}


