#ifndef WIFI_UTIL_H
#define WIFI_UTIL_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

using namespace std;

const int MAX_WIFI_ATTEMPTS = 10;

class WifiUtil {
public:
    static const String HearbeatEndpoint;
    static const String TrafficDataIndividualEndpoint;

    bool connectToWifi(const Configuration& config);

    void connect(const Configuration& config);

    String makeGetRequest(String& endpoint, const Configuration& config);

    void makeHttpPostRequest(const String &endpoint, const String &jsonStr, const Configuration &config);

    void sendHearbeat(const Configuration& config);

    void sendSpeedDataIndividual(float& speed, String& timestamp, const Configuration &config);
};

#endif // WIFI_UTIL_H