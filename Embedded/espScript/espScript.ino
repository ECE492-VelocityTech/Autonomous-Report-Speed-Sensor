#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <ArduinoJson.h>

#include "config.h"
#include "wifiUtil.h"
#include <EEPROM.h>

using namespace std;

#define LED_PIN 2  // Define the GPIO pin for the LED
#define RXD2 16
#define TXD2 17

const char* DeviceName = "CARSS_Module";
const char* BLEServiceUUID = "020a260e-cd71-49ec-a4ee-cf9183206e7d";
const char* BLECharUUID = "221a1cf8-875c-4654-b7db-bfad7b5b7cf4";

enum class OperationMode {
  Pairing,
  Operation
};

Configuration config;
OperationMode operationMode = OperationMode::Pairing;

BLEServer* pServer = nullptr;
BLECharacteristic* pCharacteristic = nullptr;

class MyServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        Serial.println("Device connected!");
    }

    void onDisconnect(BLEServer* pServer) {
        Serial.println("Device disconnected!");
    }
};

class MyCharacteristicCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic* pCharacteristic) {
        std::string value = pCharacteristic->getValue();

        if (value.length() > 0) {
            Serial.print("Received value: ");
            Serial.println(value.c_str());
            parseConfigJson(value);
        }
    }

    void parseConfigJson(const std::string& jsonString) {
      // Define the size of the JSON buffer based on the size of the JSON string
      const size_t bufferSize = JSON_OBJECT_SIZE(4) + 60;

      // Create a JSON buffer to store the parsed data
      StaticJsonDocument<bufferSize> jsonDoc;

      // Parse the JSON string
      DeserializationError error = deserializeJson(jsonDoc, jsonString);

      // Check for parsing errors
      if (error) {
        Serial.print("Parsing failed: ");
        Serial.println(error.c_str());
        return;
      }

      // Extract individual fields from the JSON object
      const char* deviceName = jsonDoc["deviceName"];
      const char* wifiName = jsonDoc["wifiName"];
      const char* wifiPassword = jsonDoc["wifiPassword"];
      const char* address = jsonDoc["address"];

      // Print the extracted fields
      Serial.println("Extracted fields:");
      Serial.print("Device Name: ");
      Serial.println(deviceName);
      Serial.print("WiFi Name: ");
      Serial.println(wifiName);
      Serial.print("WiFi Password: ");
      Serial.println(wifiPassword);
      Serial.print("Address: ");
      Serial.println(address);
      config.deviceName = String(deviceName);
      config.wifiName = String(wifiName);
      saveConfiguration(config);
    }
};

void setup() {
    Serial.begin(115200);
    Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
    pinMode(LED_PIN, OUTPUT);
    initBle();
    loadConfiguration(config);
}

void initBle() {
    BLEDevice::init(DeviceName);
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());
    advertiseBle();
}

void advertiseBle() {
    BLEAdvertising* pAdvertising = pServer->getAdvertising();
    pAdvertising->addServiceUUID(BLEUUID("180D")); // Add a service UUID
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06);

    BLEService* pService = pServer->createService(BLEUUID(BLEServiceUUID));
    pCharacteristic = pService->createCharacteristic(
                         BLEUUID(BLECharUUID),
                         BLECharacteristic::PROPERTY_READ |
                         BLECharacteristic::PROPERTY_WRITE
                       );
    pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
    pCharacteristic->setValue("Hello World");

    pService->start();
    BLEDevice::startAdvertising();
}

void receiveSpeedData() {
    Serial.println(Serial2.readString());
}

void loop() {
    // Your main code here
}
