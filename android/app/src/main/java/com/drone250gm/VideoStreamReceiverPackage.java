// package com.drone250gm;

// import com.facebook.react.ReactPackage;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.uimanager.ViewManager;
// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.List;

// public class VideoStreamReceiverPackage implements ReactPackage {
// private VideoStreamReceiverModule videoModule;

// @Override
// public List<ViewManager> createViewManagers(ReactApplicationContext
// reactContext) {
// videoModule = new VideoStreamReceiverModule(reactContext,
// "udp://127.0.0.1:5602");
// List<ViewManager> managers = new ArrayList<>();
// managers.add(new VideoStreamViewManager(videoModule));
// return managers;
// }

// @Override
// public List<NativeModule> createNativeModules(ReactApplicationContext
// reactContext) {
// List<NativeModule> modules = new ArrayList<>();
// modules.add(videoModule);
// return modules;
// }
// }
