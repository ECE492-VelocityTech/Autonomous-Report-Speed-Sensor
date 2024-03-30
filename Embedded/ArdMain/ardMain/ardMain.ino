#include <ArduinoBLE.h>

BLEService customService("19B10000-E8F2-537E-4F6C-D104768A1214"); // Define the custom BLE service
BLEStringCharacteristic customCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite, 20); // Define the custom BLE characteristic

void setup() {
  Serial.begin(9600);
  
  // Begin BLE initialization
  if (!BLE.begin()) {
    Serial.println("Failed to initialize BLE!");
    while (1);
  }
  Serial.println("BLE initialized");
  
  // Set advertised local name and service UUID
  BLE.setLocalName("Arduino_BLE");
  BLE.setAdvertisedService(customService);
  
  // Add the characteristic to the service
  customService.addCharacteristic(customCharacteristic);
  
  // Add the service
  BLE.addService(customService);
  
  // Start advertising
  BLE.advertise();
  Serial.println("BLE advertising started");
}

void loop() {
  // Check if a client is connected
  BLEDevice central = BLE.central();

  // If a client is connected
  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    // While the client is still connected
    while (central.connected()) {
      // If data is available to read from the central
      if (customCharacteristic.written()) {
        // Read the data from the central
        String dataReceived = customCharacteristic.value();
        Serial.print("Received: ");
        Serial.println(dataReceived);

        // Echo the received data back to the central
        customCharacteristic.writeValue(dataReceived);
      }
    }

    // When the client disconnects
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}
