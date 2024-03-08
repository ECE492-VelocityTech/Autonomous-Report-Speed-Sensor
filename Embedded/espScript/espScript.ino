#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define LED_PIN 2  // Define the GPIO pin for the LED
#define RXD2 16
#define TXD2 17

const char DeviceName[] = "CARSS_Module";
const char BLEServiceUUID[] = "020a260e-cd71-49ec-a4ee-cf9183206e7d";
const char BLECharUUID[] = "221a1cf8-875c-4654-b7db-bfad7b5b7cf4";

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic;

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
            for (int i = 0; i < value.length(); i++) {
                Serial.print(value[i]);
            }
            Serial.println();
        }
    }

    void onWrite(BLECharacteristic *pCharacteristic, esp_ble_gatts_cb_param_t* param) {
      Serial.println("Characteristic Write 1");
      onWrite(pCharacteristic);
    }
};

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600,SERIAL_8N1,RXD2,TXD2); 

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
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue

  BLEService* pService = pServer->createService(BLEUUID(BLEServiceUUID)); // Use your own service UUID
  pCharacteristic = pService->createCharacteristic(
                     BLEUUID(BLECharUUID), // Use your own characteristic UUID
                     BLECharacteristic::PROPERTY_READ |
                     BLECharacteristic::PROPERTY_WRITE
                   );
    pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
    // Set the initial value of the characteristic
    pCharacteristic->setValue("Hello World");
  
  pService->start();
  BLEDevice::startAdvertising();
}

void receiveSpeedData() {
  Serial.println(Serial2.readString());
}

void loop() {
//  Serial.print("Data received:");
//  receiveSpeedData();
//  delay(200);
}
