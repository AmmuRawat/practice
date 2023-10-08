package com.drone250gm;

import java.net.DatagramSocket;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.SocketException;

import java.io.IOException;

import com.MAVLink.Parser;

public class socketModule {

    public static DatagramSocket socketAddr;
    public static InetAddress hostAdd;
    public static int hostPort;
    public static DatagramPacket packetReceived;

    public static DatagramSocket socketPort() {
        try {
            socketAddr = new DatagramSocket(14551); // Set 14550 to connect with drone and 14551 to connect with sitl
        } catch (SocketException e) {
            e.printStackTrace();
            // Handle the exception if needed
        }
        return socketAddr;
    }

    public static InetAddress hostAddIP() {

        return hostAdd;
    }

    public static int hostPortIP() {

        return hostPort;
    }

    public static DatagramPacket packetReceived() {
        try {
            byte[] bufferReceiver = new byte[1024];
            DatagramPacket packetReceived = new DatagramPacket(bufferReceiver, bufferReceiver.length);
            Parser mavLinkParser = new Parser();

            socketAddr.receive(packetReceived);
            hostAdd = packetReceived.getAddress();
            hostPort = packetReceived.getPort();

            return packetReceived;
        } catch (IOException ex) {
            ex.printStackTrace();
            // Handle the exception if needed
            return null;
        }
    }

    public static int send(DatagramPacket message) {
        try {

            socketAddr.send(message);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return 0;
    }

}
