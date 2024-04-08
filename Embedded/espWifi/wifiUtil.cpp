#include "wifiUtil.h"

const String WifiUtil::HearbeatEndpoint = "http://carss.chickenkiller.com/api/v1/devices/heartbeat/";

void WifiUtil::connect(const Configuration &config)
{
    Serial.print("Connecting to Wi-Fi...");

    // Convert String to const char* for WiFi connection
    const char *ssid = config.wifiName.c_str();
    const char *password = config.wifiPassword.c_str();

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);

    // Wait for Wi-Fi connection
    int attempts = 0;
    while (attempts < MAX_WIFI_ATTEMPTS && WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    std::string connected = "No";
    if (WiFi.status() == WL_CONNECTED)
    {
        connected = "Yes";
    }

    Serial.print("Connected to Wi-Fi: ");
    Serial.println(connected.c_str());
}

bool WifiUtil::connectToWifi(const Configuration &config)
{
    // Connect to WiFi
    Serial.print("[WiFi] Connecting to ");
    Serial.println(config.wifiName);
    Serial.println(config.wifiPassword);
    Serial.println(config.deviceId);

    // 30 Seconds
    int tryDelay = 600;
    int numberOfTries = 50;

    while (true)
    {
        WiFi.begin(config.wifiName.c_str(), config.wifiPassword.c_str());

        // Retry connection until successful or maximum tries reached
        while (WiFi.status() != WL_CONNECTED && numberOfTries > 0)
        {
            Serial.print(".");
            delay(tryDelay);
            numberOfTries--;

            if (WiFi.status() == WL_CONNECTED)
            {
                break; // Exit the loop if connected during retry
            }

            if (numberOfTries <= 0)
            {
                Serial.println("[WiFi] Failed to connect to WiFi!");
            }
        }

        // Check if connected and obtain IP address
        if (WiFi.status() == WL_CONNECTED)
        {
            Serial.println();
            Serial.println("[WiFi] WiFi is connected!");
            Serial.print("[WiFi] IP address: ");
            Serial.println(WiFi.localIP());

            // Check if local IP is valid
            if (WiFi.localIP() == IPAddress(0, 0, 0, 0))
            {
                Serial.println("[WiFi] WiFi connected, but local IP is 0.0.0.0. Retrying...");
                numberOfTries = 50; // Reset the number of tries
            }
            else
            {
                return true; // Exit the function if connection is successful
            }
        }

        // Check WiFi status and handle different cases
        switch (WiFi.status())
        {
        case WL_NO_SSID_AVAIL:
            Serial.println("[WiFi] SSID not found");
            break;
        case WL_CONNECT_FAILED:
            Serial.print("[WiFi] Failed - WiFi not connected! Reason: ");
            break;
        case WL_CONNECTION_LOST:
            Serial.println("[WiFi] Connection was lost");
            break;
        case WL_SCAN_COMPLETED:
            Serial.println("[WiFi] Scan is completed");
            break;
        case WL_DISCONNECTED:
            Serial.println("[WiFi] WiFi is disconnected");
            break;
        default:
            Serial.print("[WiFi] WiFi Status: ");
            Serial.println(WiFi.status());
            break;
        }

        delay(tryDelay);
    }
    return false;
}

String WifiUtil::makeGetRequest(String &endpoint, const Configuration &config)
{
    while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0, 0, 0, 0))
    {
        Serial.println("Connecting to WIFI");
        connectToWifi(config);
    }

    String resp = "";
    HTTPClient http;
    http.setTimeout(10000);

    // Start the HTTP request
    Serial.print("Making Get Request: ");
    Serial.println(endpoint);
    http.begin(endpoint);

    // Send the GET request
    int httpResponseCode = http.GET();

    // Check for a successful response
    if (httpResponseCode > 0)
    {
        Serial.print("HTTP Response Code: ");
        Serial.println(httpResponseCode);

        Serial.print("HTTP Response: ");
        Serial.println(http.getString());
        resp = http.getString();
    }
    else
    {
        Serial.print("HTTP Request failed, error: ");
        Serial.print(httpResponseCode);
        Serial.print(" - ");
        Serial.println(http.errorToString(httpResponseCode));
    }

    // Close the connection
    http.end();
    return resp;
}

void WifiUtil::sendHearbeat(const Configuration &config)
{
    Serial.println("**Sending Hearbeat**");
    String hearbeatEndpoint = HearbeatEndpoint;
    hearbeatEndpoint.concat(config.deviceId);
    String heartbeatResult = makeGetRequest(hearbeatEndpoint, config);
}