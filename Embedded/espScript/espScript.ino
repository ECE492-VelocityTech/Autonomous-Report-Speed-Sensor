#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <ArduinoJson.h>

#include "config.h"
#include "wifiUtil.h"
#include <EEPROM.h>

#define LED_PIN 2  // Define the GPIO pin for the LED
#define RXD2 16
#define TXD2 17

const char* DeviceName = "CARSS_Module";
const char* BLEServiceUUID = "020a260e-cd71-49ec-a4ee-cf9183206e7d";
const char* BLECharUUID = "221a1cf8-875c-4654-b7db-bfad7b5b7cf4";

OperationMode operationMode = OperationMode::Pairing;

BLEServer* pServer = nullptr;
BLECharacteristic* pCharacteristic = nullptr;

void connectWifi(const Configuration& config) {
    Serial.print("Connecting to Wi-Fi...");
    const char* ssid = config.wifiName.c_str();
    const char* password = config.wifiPassword.c_str();
    WiFi.begin(ssid, password);
}

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
            // Parse configuration JSON here if needed
        }
    }
};

void setup() {
    Serial.begin(115200);
    Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
    pinMode(LED_PIN, OUTPUT);
    initBle();
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
    pAdvertising->start(); // Start advertising
}

void receiveSpeedData() {
    Serial.println(Serial2.readString());
}

void loop() {
    // Your main code here
}
