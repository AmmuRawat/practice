// package com.drone250gm;

// import android.content.Context;
// import android.view.SurfaceHolder;
// import android.view.SurfaceView;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import org.freedesktop.gstreamer.Element;
// import org.freedesktop.gstreamer.Gst;
// import org.freedesktop.gstreamer.Pipeline;
// import org.freedesktop.gstreamer.State;
// import org.freedesktop.gstreamer.lowlevel.GstVideoOverlayAPI;

// public class VideoStreamReceiverModule extends ReactContextBaseJavaModule
// implements SurfaceHolder.Callback {
// private Pipeline pipeline;
// private String streamAddress;
// private SurfaceView surfaceView;

// public VideoStreamReceiverModule(ReactApplicationContext reactContext, String
// streamAddress) {
// super(reactContext);
// this.streamAddress = streamAddress;
// Gst.init("VideoStreamReceiver", new String[] {});
// this.surfaceView = new SurfaceView(reactContext);
// this.surfaceView.getHolder().addCallback(this);

// pipeline = (Pipeline) Gst.parseLaunch("udpsrc uri=" + streamAddress
// + " caps=\"application/x-rtp, media=(string)video, clock-rate=(int)90000,
// encoding-name=(string)H264, payload=(int)96\" ! rtph264depay ! decodebin !
// videoconvert ! glimagesink name=sink");
// }

// @Override
// public String getName() {
// return "VideoStreamReceiver";
// }

// @ReactMethod
// public void start() {
// pipeline.setState(State.PLAYING);
// }

// @ReactMethod
// public void stop() {
// pipeline.setState(State.NULL);
// }

// @Override
// public void surfaceCreated(SurfaceHolder holder) {
// Element sink = pipeline.getElementByName("sink");

// if (sink instanceof GstVideoOverlayAPI) {
// ((GstVideoOverlayAPI) sink).setWindowHandle(holder.getSurface());
// pipeline.setState(State.PLAYING);
// }
// }

// @Override
// public void surfaceChanged(SurfaceHolder holder, int format, int width, int
// height) {
// // Handle surface changes here
// }

// @Override
// public void surfaceDestroyed(SurfaceHolder holder) {
// pipeline.setState(State.NULL);
// }

// public SurfaceView getSurfaceView() {
// return this.surfaceView;
// }

// public void setStreamAddress(String streamAddress) {
// this.streamAddress = streamAddress;
// }
// }
