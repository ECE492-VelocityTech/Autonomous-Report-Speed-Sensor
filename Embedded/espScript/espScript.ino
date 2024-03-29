#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <ArduinoJson.h> 

#define LED_PIN 2  // Define the GPIO pin for the LED
#define RXD2 16
#define TXD2 17

const char DeviceName[] = "CARSS_Module";
const char BLEServiceUUID[] = "020a260e-cd71-49ec-a4ee-cf9183206e7d";
const char BLECharUUID[] = "221a1cf8-875c-4654-b7db-bfad7b5b7cf4";

// Define an enum for LED colors
enum class OperationMode {
  Pairing,
  Operation
};

OperationMode operationMode = OperationMode::Pairing;


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
            parseConfigJson(value);
        }
        
    }

    void onWrite(BLECharacteristic *pCharacteristic, esp_ble_gatts_cb_param_t* param) {
      Serial.println("Characteristic Write 1");
      onWrite(pCharacteristic);
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
    }
};

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600,SERIAL_8N1,RXD2,TXD2); 

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
  ledBlink();
  delay(200);

}

void ledBlink() {
  if (operationMode == OperationMode::Pairing) {
    ledPairingMode();
  }
}

void ledPairingMode() {
  digitalWrite(LED_PIN, HIGH); // Turn on the LED
  delay(500); // Wait for 500 milliseconds (half of the period)
  digitalWrite(LED_PIN, LOW); // Turn off the LED
  delay(500); // Wait for another 500 milliseconds (half of the period)
}

void ledOperationMode() {
  digitalWrite(LED_PIN, HIGH); // Turn on the LED
  delay(1000); // Wait for 500 milliseconds (half of the period)
  digitalWrite(LED_PIN, LOW); // Turn off the LED
  delay(1000); // Wait for another 500 milliseconds (half of the period)
}
