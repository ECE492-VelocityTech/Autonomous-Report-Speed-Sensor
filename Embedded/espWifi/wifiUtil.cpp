#include "wifiUtil.h"

const String WifiUtil::HearbeatEndpoint = "http://carss.chickenkiller.com/api/v1/devices/heartbeat/";
const String WifiUtil::TrafficDataIndividualEndpoint = "http://carss.chickenkiller.com/api/v1/trafficData/device/";
const String WifiUtil::TrafficDataBatchEndpoint = "http://carss.chickenkiller.com/api/v1/trafficData/batch/device/";



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
        resp = http.getString();
        Serial.println(resp);
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

String WifiUtil::makeHttpPostRequest(const String &endpoint, const String &jsonStr, const Configuration &config)
{
    String result;
    while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0, 0, 0, 0))
    {
        Serial.println("Connecting to WIFI");
        connectToWifi(config);
    }

    if (jsonStr.length() == 0)
    {
        Serial.println("[HTTP] JSON string is empty or null");
        return "err: missingBody";
    }

    HTTPClient http;
    http.setTimeout(10000);

    // Start the HTTP request
    http.begin(endpoint);

    // Set content type header
    http.addHeader("Content-Type", "application/json");

    // Send the POST request with JSON body
    int httpResponseCode = http.POST(jsonStr);

    // Check for a successful response
    if (httpResponseCode > 0)
    {
        Serial.print("HTTP Response Code: ");
        Serial.println(httpResponseCode);

        // Print Response
        Serial.print("HTTP Response:");
        Serial.println(http.getString());
        result = http.getString();
    }
    else
    {
        Serial.print("HTTP Request failed, error: ");
        Serial.print(httpResponseCode);
        Serial.print(" - ");
        Serial.println(http.errorToString(httpResponseCode));
        result = "err";
    }

    // Close the connection
    http.end();
    return result;
}

void WifiUtil::parseJSON(DynamicJsonDocument& doc, String& json) {
    deserializeJson(doc, json);
}

void WifiUtil::sendHearbeat(const Configuration &config)
{
    Serial.println("**Sending Hearbeat**");
    String hearbeatEndpoint = HearbeatEndpoint;
    hearbeatEndpoint.concat(config.deviceId);
    String heartbeatResult = makeGetRequest(hearbeatEndpoint, config);
    parseServerResp(heartbeatResult);
}

void WifiUtil::sendHearbeatIfRequired(const Configuration& config) {
    unsigned long currentMillis = millis();
    if (hearbeatMillis == 0) { hearbeatMillis = currentMillis; }
    
    if (currentMillis - hearbeatMillis >= 5000) {
        Serial.println("***Sending Regular Hearbeat***");
        // send heartbeat and reset timer
        hearbeatMillis = 0; 
        sendHearbeat(config);
    }
}

void WifiUtil::sendSpeedDataIndividual(float& speed, String& timestamp, const Configuration &config)
{
    // Create JSON object
    StaticJsonDocument<128> doc;
    doc["speed"] = speed;
    doc["timestamp"] = timestamp;

    // Serialize JSON object to string
    String jsonStr;
    serializeJson(doc, jsonStr);

    // Print JSON string
    Serial.println(jsonStr); // TODO Remove

    // Make HTTP POST request
    Serial.println("**Sending Traffic Data**");
    String trafficDataEndpoint = TrafficDataIndividualEndpoint;
    trafficDataEndpoint.concat(config.deviceId);
    Serial.println("Endpoint: " + trafficDataEndpoint);
    makeHttpPostRequest(trafficDataEndpoint, jsonStr, config);
}

String WifiUtil::sendSpeedDataBatch(const Configuration &config) {
    // Create a DynamicJsonDocument
    DynamicJsonDocument doc(1024);

    // Create a JsonArray
    JsonArray data = doc.to<JsonArray>();

    // Add data to the JsonArray
    for (int i = 0; i < aggrSpeedIndex; i++) {
        JsonObject obj = data.createNestedObject();
        obj["speed"] = aggrSpeeds[i];
        obj["timestamp"] = aggrTimestamps[i];
    }

    // Serialize the JSON document to a String
    String jsonStr;
    serializeJson(doc, jsonStr);

    Serial.println("**Sending Traffic Data Batch** \nData: ");
    Serial.println(jsonStr);
    String trafficDataEndpoint = TrafficDataBatchEndpoint;
    trafficDataEndpoint.concat(config.deviceId);
    Serial.println("Endpoint: " + trafficDataEndpoint);
    return makeHttpPostRequest(trafficDataEndpoint, jsonStr, config);
}

