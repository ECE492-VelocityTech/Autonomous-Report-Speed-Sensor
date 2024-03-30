#include "wifiUtil.h"

void WifiUtil::connect(const Configuration& config) {
    Serial.print("Connecting to Wi-Fi...");
    
    // Convert String to const char* for WiFi connection
    const char* ssid = config.wifiName.c_str();
    const char* password = config.wifiPassword.c_str();

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);

    // Wait for Wi-Fi connection
    int attempts = 0; 
    while (attempts < MAX_WIFI_ATTEMPTS && WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    std::string connected = "No";
    if (WiFi.status() == WL_CONNECTED) {
        connected = "Yes";
    }

    Serial.print("Connected to Wi-Fi: ");
    Serial.println(connected.c_str());
}