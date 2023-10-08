package com.drone250gm;

import android.os.Environment;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class SDPFileModule extends ReactContextBaseJavaModule {

    private static final String TAG = "SDPFileModule";

    public SDPFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SDPFileModule";
    }

    @ReactMethod
    public void createSDPFile() {
        try {
            File file = new File(getReactApplicationContext().getExternalFilesDir(null), "stream.sdp");

            PrintWriter writer = new PrintWriter(new FileWriter(file));

            writer.println("v=0");
            writer.println("o=- 0 0 IN IP4 192.168.219.59");
            writer.println("s=No Name");
            writer.println("c=IN IP4 192.168.219.59");
            writer.println("t=0 0");
            writer.println("a=tool:libavformat 58.76.100");
            writer.println("m=video 5603 RTP/AVP 96");
            writer.println("a=rtpmap:96 H264/90000");

            writer.close();
        } catch (IOException e) {
            Log.e(TAG, "Error creating SDP file", e);
        }
    }
}
