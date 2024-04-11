#ifndef WIFI_UTIL_H
#define WIFI_UTIL_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

using namespace std;

const int MAX_WIFI_ATTEMPTS = 10;
const String BACKEND_BASE = "http://carss.chickenkiller.com/backend";

extern float aggrSpeeds[15]; // Array to store speeds
extern String aggrTimestamps[15]; // Array to store timestamps
extern int aggrSpeedIndex; // Index to keep track of the number of speeds stored

extern DeviceStatus deviceStatus; // determines the status of the device

class WifiUtil {
    unsigned long hearbeatMillis = 0;

public:
    static const String HearbeatEndpoint;
    static const String TrafficDataIndividualEndpoint;
    static const String TrafficDataBatchEndpoint;

    bool connectToWifi(const Configuration& config);

    void connect(const Configuration& config);

    String makeGetRequest(String& endpoint, const Configuration& config);

    String makeHttpPostRequest(const String &endpoint, const String &jsonStr, const Configuration &config);

    void sendHearbeat(const Configuration& config);

    void sendHearbeatIfRequired(const Configuration& config);

    void sendSpeedDataIndividual(float& speed, String& timestamp, const Configuration &config);

    String sendSpeedDataBatch(const Configuration &config);

    void parseJSON(DynamicJsonDocument& doc, String& json);
};

#endif // WIFI_UTIL_H