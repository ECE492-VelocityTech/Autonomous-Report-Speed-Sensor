

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

//#define REQUEST_ADD_OWNER 1
//#define REQUEST_ADD_DEVICE_TO_OWNER 2
#define REQUEST_ADD_TRAFFIC_DATA 1
#define REQUEST_GET_TRAFFIC 2


String ssid     =  "iPhone (8)";
String password =  "inioluwa";
String deviceId = "11";
String trafficDataEndpoint = "http://carss.chickenkiller.com/api/v1/trafficData"; 
String ownerEndpoint = "http://carss.chickenkiller.com/api/v1/owners";
String devicesEndpoint = "http://carss.chickenkiller.com/api/v1/devices";
float speeds[10]; // Array to store speeds
String timestamps[10];
const char* ntpServer = "pool.ntp.org";
String currYear = "2024";
String currMonth = "04";
String currDay = "06";
const int  gmtOffset_sec = -6 * 3600;  // GMT offset in seconds
const int   daylightOffset_sec = 3600; // Daylight offset in seconds

WiFiUDP udp;
NTPClient timeClient(udp, ntpServer, gmtOffset_sec, daylightOffset_sec);


int btnGPIO = 0;
int btnState = false;



void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);
  
  delay(10);

//  getWifiCredentials();
//  getDeviceId();
  connectToWifi();
  timeClient.begin();
timeClient.update();

  Serial.println("TIME:");
  Serial.println(timeClient.getFormattedTime());
  Serial2.println("Ready to receive speed data");
  handleRequests();
}

void loop()
{
  // Read the button state
  btnState = digitalRead(btnGPIO);

  if (btnState == LOW) {
    // Disconnect from WiFi
    Serial.println("[WiFi] Disconnecting from WiFi!");
    // This function will disconnect and turn off the WiFi (NVS WiFi data is kept)
    if (WiFi.disconnect(true, false)) {
      Serial.println("[WiFi] Disconnected from WiFi!");
    }
    delay(1000);
  }
}

void getWifiCredentials(){
  // Get WiFi username and password from user input
  Serial.println("Enter WiFi SSID:");
  while (Serial.available() == 0) {
    // Wait for user input
  }
  ssid = Serial.readStringUntil('\n');
  Serial.println("Received SSID: " + ssid);
  
  Serial.println("Enter WiFi Password:");
  while (Serial.available() == 0) {
    // Wait for user input
  }
  password = Serial.readStringUntil('\n');
}

void getDeviceId(){
  
  Serial.println("Enter Device ID:");
  while (Serial.available() == 0) {
    // Wait for user input
  }
  deviceId = Serial.readStringUntil('\n');
  Serial.println("Received Device ID: " + deviceId);
}

void connectToWifi() {
  // Connect to WiFi
  Serial.print("[WiFi] Connecting to ");
  Serial.println(ssid);

  int tryDelay = 600;
  int numberOfTries = 50;

  while (true) {
    WiFi.begin(ssid.c_str(), password.c_str());

    // Retry connection until successful or maximum tries reached
    while (WiFi.status() != WL_CONNECTED && numberOfTries > 0) {
      Serial.print(".");
      delay(tryDelay);
      numberOfTries--;

      if (WiFi.status() == WL_CONNECTED) {
        break;  // Exit the loop if connected during retry
      }

      if (numberOfTries <= 0) {
        Serial.println("[WiFi] Failed to connect to WiFi!");
//        return;
      }
    }

    // Check if connected and obtain IP address
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println();
      Serial.println("[WiFi] WiFi is connected!");
      Serial.print("[WiFi] IP address: ");
      Serial.println(WiFi.localIP());

      // Check if local IP is valid
      if (WiFi.localIP() == IPAddress(0, 0, 0, 0)) {
        Serial.println("[WiFi] WiFi connected, but local IP is 0.0.0.0. Retrying...");
        numberOfTries = 50; // Reset the number of tries
      } else {
        return; // Exit the function if connection is successful
      }
    }

    // Check WiFi status and handle different cases
    switch (WiFi.status()) {
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


void handleRequests() {
  int speedIndex = 0; // Index to keep track of the number of speeds stored

  while (true) {
    // Read input from serial with timeout
    String input;
    while (Serial2.available() == 0) {
      delay(100); // Wait for input
    }
    input = Serial2.readStringUntil('\n');
    
    // Check if input is a valid float
    float speed = 0.0;
    if (input.toFloat() != 0.0 || input.equals("0.0")) { // Check if input is a valid float or "0.0"
      speed = input.toFloat(); // Convert input string to float

      // Update speed array and timestamp array
      if (speedIndex < 10) {
        speeds[speedIndex] = speed;
        timestamps[speedIndex] = getTimestamp(); // Update timestamp for the current index
        speedIndex++;
      }

      // Check if the speed array is full
      if (speedIndex == 10) {
        addTrafficData(); // Call function to add traffic data
        speedIndex = 0; // Reset speed index
      }
    } else {
      Serial.println("Invalid input: " + input); // Print error message for invalid input
    }
  }
}




//void addOwner(){
//  Serial.println("Adding owner");
//  String email = Serial.readStringUntil(',');
//  email.trim();
//  String address = Serial.readStringUntil(',');
//  address.trim();
//
//  Serial.println(email);
//  Serial.println(address);
//
//  StaticJsonDocument<256> doc;
//  doc["email"] = email;
//  doc["address"] = address;
//
//  String jsonStr;
//  serializeJson(doc, jsonStr);
//
//  makeHttpPostRequest(ownerEndpoint, jsonStr);
//}
//
//void addDeviceToOwner(){
//  Serial.println("Adding device to owner");
//  String ownerId = Serial.readStringUntil(',');
//  ownerId.trim();
//
//  String deviceNoIn = Serial.readStringUntil(',');
//  deviceNoIn.trim();
//  int deviceNo = deviceNoIn.toInt();
//
//  String address = Serial.readStringUntil(',');
//  address.trim();
//
//  StaticJsonDocument<256> doc;
//  doc["deviceNo"] = deviceNo;
//  doc["address"] = address;
//
//  // Serialize JSON to string
//  String jsonStr;
//  serializeJson(doc, jsonStr);
//  Serial.println(jsonStr);
//
//  makeHttpPostRequest(devicesEndpoint + "/owner/" + ownerId, jsonStr);
//}

void addTrafficData() {
  for (int i = 0; i < 10; i++) {
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
    makeHttpPostRequest(trafficDataEndpoint + "/device/" + deviceId, jsonStr);
  }
}


void makeHttpPostRequest(const String& endpoint, const String& jsonStr) {

  while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0,0,0,0)){
    connectToWifi();
  }

  if (jsonStr.length() == 0) {
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
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    // Parse JSON response (if any)
    DynamicJsonDocument doc(2048); // Adjust the size based on expected response size
    deserializeJson(doc, http.getString());

    // Print JSON data
    Serial.println("JSON Response:");
    serializeJsonPretty(doc, Serial);
  } else {
    Serial.print("HTTP Request failed, error: ");
    Serial.print(httpResponseCode);
    Serial.print(" - ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  // Close the connection
  http.end();
}

void makeHttpGetRequest() {

  while (WiFi.status() != WL_CONNECTED || WiFi.localIP() == IPAddress(0,0,0,0)){
    connectToWifi();
  }
  HTTPClient http;
  http.setTimeout(10000);

  // Start the HTTP request
  http.begin(trafficDataEndpoint);

  // Send the GET request
  int httpResponseCode = http.GET();

  // Check for a successful response
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    // Parse JSON
    DynamicJsonDocument doc(2048);  // Adjust the size based on your expected JSON response size
    deserializeJson(doc, http.getString());

    // Print JSON data
    Serial.println("JSON Response:");
    serializeJsonPretty(doc, Serial);
  } else {
    Serial.print("HTTP Request failed, error: ");
    Serial.print(httpResponseCode);
    Serial.print(" - ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  // Close the connection
  http.end();
}
String getTimestamp() {
  timeClient.update(); // Update time from NTP server

  // Get current time components
  int currentHour = timeClient.getHours();
  int currentMinute = timeClient.getMinutes();
  int currentSecond = timeClient.getSeconds();

  // Check if it's midnight (hour = 0, minute = 0, second = 0)
  if (currentHour == 0 && currentMinute == 0 && currentSecond == 0) {
    // Increment the day
    int currentDay = currDay.toInt();
    currentDay++; // Increment day by one

    // Check if the month needs to be updated
    int daysInMonth = getDaysInMonth(currYear.toInt(), currMonth.toInt());
    if (currentDay > daysInMonth) {
      currentDay = 1; // Reset day to 1
      int currentMonth = currMonth.toInt();
      currentMonth++; // Increment month by one
      if (currentMonth > 12) {
        // Increment the year if the month exceeds 12
        int currentYear = currYear.toInt();
        currentYear++; // Increment year by one
        currYear = String(currentYear); // Update year
        currMonth = "1"; // Reset month to January (1)
      } else {
        currMonth = String(currentMonth); // Update month
      }
    }

    currDay = String(currentDay); // Update day
  }

  // Construct timestamp string
  String timestamp = currYear + "-" + currMonth + "-" + currDay + "T" + timeClient.getFormattedTime(); // Get formatted time

  return timestamp;
}

// Function to get the number of days in a month
int getDaysInMonth(int year, int month) {
  if (month == 2) {
    // Check for leap year
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
      return 29; // February has 29 days in a leap year
    } else {
      return 28; // February has 28 days in a non-leap year
    }
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    return 30; // April, June, September, November have 30 days
  } else {
    return 31; // January, March, May, July, August, October, December have 31 days
  }
}
