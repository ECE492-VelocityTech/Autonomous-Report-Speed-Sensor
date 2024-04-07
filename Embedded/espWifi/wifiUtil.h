#ifndef WIFI_UTIL_H
#define WIFI_UTIL_H

#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h"

using namespace std;

const int MAX_WIFI_ATTEMPTS = 10;

class WifiUtil {
public:
    void connectToWifi(const Configuration& config);

    void connect(const Configuration& config);

    void sendHearbeat(const Configuration& config);
};

#endif // WIFI_UTIL_H