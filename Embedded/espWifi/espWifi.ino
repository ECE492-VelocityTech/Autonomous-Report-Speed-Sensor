

/* Wi-Fi STA Connect and Disconnect Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.

*/
#include <WiFi.h>
#include <HTTPClient.h>
#include <NTPClient.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <TimeLib.h>

#include "config.h"
#include "wifiUtil.h"
#include "speedUtil.h"

// #define REQUEST_ADD_OWNER 1
// #define REQUEST_ADD_DEVICE_TO_OWNER 2
#define REQUEST_ADD_TRAFFIC_DATA 1
#define REQUEST_GET_TRAFFIC 2

// String ssid     =  "iPhone (8)";
String ssid = "Mehar iPhone";
// String password =  "inioluwa";
String password = "123456789";
String deviceId = "11";
String trafficDataEndpoint = "http://carss.chickenkiller.com/api/v1/trafficData";
String ownerEndpoint = "http://carss.chickenkiller.com/api/v1/owners";
String devicesEndpoint = "http://carss.chickenkiller.com/api/v1/devices";
String timeEndpoint = "http://carss.chickenkiller.com/api/v1/devices/time";
String hearbeatEndpoint = "http://carss.chickenkiller.com/api/v1/devices/hearbeat";

const char *ntpServer = "pool.ntp.org";
String currYear = "";
String currMonth = "";
String currDay = "";
int currHour = 0;
int currMin = 0;
int currSecond = 0;
const int gmtOffset_sec = -6 * 3600; // GMT offset in seconds
const int daylightOffset_sec = 3600; // Daylight offset in seconds
float speeds[15]; // Array to store speeds
String timestamps[15]; // Array to store timestamps

int speedIndex = 0; // Index to keep track of the number of speeds stored

WiFiUDP udp;
NTPClient timeClient(udp, ntpServer, gmtOffset_sec, daylightOffset_sec);

WifiUtil wifiUtil;

const int btnGPIO = 0;
int btnState = false;

Configuration config;

void setup()
{
  Serial.begin(115200);
  Serial2.begin(9600);

  clearConfig(); // TODO Remove Debug

  delay(5000); // To give time for other system to start

  initPins();
  initConfig();
  initTime();
}

void loop()
{
  Serial.println("Looping");
  if(Serial2.available() > 0)
  {
    // Speed Data avilable
    getSpeedData(timeClient, currYear, currMonth, currDay);
  }
  bool resetRequested = isResetRequested(btnGPIO);
  if (resetRequested) { resetDevice(); } // Reset Device if reset requested;
  updateTimeIfReq();
  delay(1000);
}

void initPins()
{
  pinMode(btnGPIO, INPUT_PULLUP);
}

void initConfig()
{
  bool foundConfig = loadConfiguration(config);
  Serial.print("Config Present: "); // TODO Remove
  Serial.println(foundConfig); // // TODO Remove
  bool connectionSuccess = false;
  if (!foundConfig)
  {
    // TODO: Handle case when WiFi cannot connect
    receiveConfigFromBleEsp(config);
    connectionSuccess = wifiUtil.connectToWifi(config);
    sendWifiStatusToBleEsp(connectionSuccess);
  } else {
    // TODO: Refine case when config present but WiFi not connected
    connectionSuccess = wifiUtil.connectToWifi(config);
    sendWifiStatusToBleEsp(connectionSuccess);
  }
  
  if (connectionSuccess) { wifiUtil.sendHearbeat(config); } // send hearbeat to Server
}

void initTime() {
  timeClient.begin();
  timeClient.update();
  updateTime();

  currHour = timeClient.getHours();
  currMin = timeClient.getMinutes();
  currSecond = timeClient.getSeconds();

  currYear + "-" + currMonth + "-" + currDay + "T" + timeClient.getFormattedTime();

  Serial.println("TIME:");
  Serial.println(timeClient.getFormattedTime());
  Serial2.println("Ready to receive speed data");
}

void getWifiCredentials()
{
  // Get WiFi username and password from user input
  Serial.println("Ready to receive data");
  while (Serial.available() == 0)
  {
    // Wait for user input
  }
  ssid = Serial.readStringUntil('\n');
  Serial.println("Received SSID: " + ssid);
  Serial.println("ACK");

  //  Serial.println("Ready to receive Wifi password");
  while (Serial.available() == 0)
  {
    // Wait for user input
  }
  password = Serial.readStringUntil('\n');
  //  Serial.println("ACK");
}

void getDeviceId()
{

  Serial.println("Ready to receive device ID");
  while (Serial.available() == 0)
  {
    // Wait for user input
  }
  deviceId = Serial.readStringUntil('\n');
  Serial.println("Received Device ID: " + deviceId);
}

void connectToWifi()
{
  // Connect to WiFi
  Serial.print("[WiFi] Connecting to ");
  Serial.println(config.wifiName);
  Serial.println(config.wifiPassword);
  Serial.println(config.deviceId);

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
        //        return;
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
        return; // Exit the function if connection is successful
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
}

// void handleRequests()
// {
//   int speedIndex = 0; // Index to keep track of the number of speeds stored

//   while (true)
//   {
//     // Read input from serial with timeout
//     String input;
//     while (Serial2.available() == 0)
//     {
//       delay(100); // Wait for input
//       isResetRequested(btnGPIO);
//     }
//     input = Serial2.readStringUntil('\n');

//     // Check if input is a valid float
//     float speed = 0.0;
//     if (input.toFloat() != 0.0 || input.equals("0.0"))
//     {                          // Check if input is a valid float or "0.0"
//       speed = input.toFloat(); // Convert input string to float

//       // Update speed array and timestamp array
//       if (speedIndex < 10)
//       {
//         speeds[speedIndex] = speed;
//         timestamps[speedIndex] = getTimestamp(); // Update timestamp for the current index
//         speedIndex++;
//       }

//       // Check if the speed array is full
//       if (speedIndex == 10)
//       {
//         addTrafficData(); // Call function to add traffic data
//         speedIndex = 0;   // Reset speed index
//       }
//     }
//     else
//     {
//       Serial.println("Invalid input: " + input); // Print error message for invalid input
//     }
//   }
// }


void addTrafficData()
{
  for (int i = 0; i < 10; i++)
  {
    // Read speed and timestamp from arrays
    float speed = speeds[i];
    String timestamp = timestamps[i];

    // Create JSON object
    StaticJsonDocument<128> doc;
    doc["speed"] = speed;
    doc["timestamp"] = timestamp;

    // Serialize JSON object to string
    String jsonStr;
    serializeJson(doc, jsonStr);

    // Print JSON string
    Serial.println(jsonStr);

    // Make HTTP POST request
    Serial.println("Endpoint: " + trafficDataEndpoint + "/device/" + config.deviceId);
    makeHttpPostRequest(trafficDataEndpoint + "/device/" + deviceId, jsonStr);
  }
}

void makeHttpPostRequest(const String &endpoint, const String &jsonStr)
{

  while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0, 0, 0, 0))
  {
    connectToWifi();
  }

  if (jsonStr.length() == 0)
  {
    Serial.println("[HTTP] JSON string is empty or null");
    return;
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

    // Parse JSON response (if any)
    DynamicJsonDocument doc(2048); // Adjust the size based on expected response size
    deserializeJson(doc, http.getString());

    // Print JSON data
    Serial.println("JSON Response:");
    serializeJsonPretty(doc, Serial);
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
}

void makeHttpGetRequest()
{
  while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0, 0, 0, 0))
  {
    connectToWifi();
  }
  HTTPClient http;
  http.setTimeout(10000);

  // Start the HTTP request
  http.begin(trafficDataEndpoint);

  // Send the GET request
  int httpResponseCode = http.GET();

  // Check for a successful response
  if (httpResponseCode > 0)
  {
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    // Parse JSON
    DynamicJsonDocument doc(2048); // Adjust the size based on your expected JSON response size
    deserializeJson(doc, http.getString());

    // Print JSON data
    Serial.println("JSON Response:");
    serializeJsonPretty(doc, Serial);
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
}

void updateTimeIfReq() {
  // Get current time components
  int currentHour = timeClient.getHours();

  if (currentHour < currHour) { updateTime(); }
}

void updateTime()
{
  while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0, 0, 0, 0))
  {
    connectToWifi();
  }
  HTTPClient http;
  http.setTimeout(10000);

  // Start the HTTP request
  http.begin(timeEndpoint);

  // Send the GET request
  int httpResponseCode = http.GET();

  // Check for a successful response
  if (httpResponseCode > 0)
  {
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    // Read the response from the server
    String response = http.getString();

    // Extract year, month, and day from the response
    int hyphenIndex1 = response.indexOf('-');
    int hyphenIndex2 = response.lastIndexOf('-');
    if (hyphenIndex1 != -1 && hyphenIndex2 != -1 && hyphenIndex2 > hyphenIndex1)
    {
      currYear = response.substring(0, hyphenIndex1);
      currMonth = response.substring(hyphenIndex1 + 1, hyphenIndex2);
      currDay = response.substring(hyphenIndex2 + 1);
    }
    else
    {
      Serial.println("Error parsing response: Invalid date format");
    }
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
}


// Function to get the number of days in a month
int getDaysInMonth(int year, int month)
{
  if (month == 2)
  {
    // Check for leap year
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
    {
      return 29; // February has 29 days in a leap year
    }
    else
    {
      return 28; // February has 28 days in a non-leap year
    }
  }
  else if (month == 4 || month == 6 || month == 9 || month == 11)
  {
    return 30; // April, June, September, November have 30 days
  }
  else
  {
    return 31; // January, March, May, July, August, October, December have 31 days
  }
}
