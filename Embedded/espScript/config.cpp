#include "config.h"
#include <EEPROM.h>

void saveConfiguration(const Configuration& config) {
  EEPROM.begin(sizeof(Configuration) + sizeof(CONFIG_MARKER)); // Reserve space for configuration, flag, and marker
  EEPROM.put(0, CONFIG_MARKER); // Write marker value
  EEPROM.put(sizeof(CONFIG_MARKER), config); // Write configuration
  EEPROM.commit();
  EEPROM.end();
}

bool loadConfiguration(Configuration& config) {
    bool configFound = false;
    uint32_t marker;
    EEPROM.begin(sizeof(Configuration) + sizeof(CONFIG_MARKER));
    EEPROM.get(0, marker); // Read marker value

    if (marker == CONFIG_MARKER) {
        configFound = true;
        EEPROM.get(sizeof(CONFIG_MARKER), config); // Read configuration data if marker value indicates it's valid
        Serial.println(config.deviceName);
    } else {
        Serial.println("No config found"); // TODO: Remove
    }
    EEPROM.end();

    return configFound;
}

void sendConfigToWifiEsp(const Configuration& config) {
    String buff;
    Serial.println("SendConfigToWifiEsp");

    waitForSerial2ToReceive("Ready to receive data", buff);
    Serial.println("Received INIT");
    // send Wifi Cred
    buff = config.wifiName + "\n" + config.wifiPassword + "\n";
    buff.concat(config.deviceId);
    // input = "Mehar iPhone\n123456789\n17";
    // input += String(config.deviceId);
    Serial.println("Sent to ESPWIFI: " + buff); // TODO Remove
    Serial2.println(buff);

    waitForSerial2ToReceive("ACK", buff);
    Serial.println("Received " + buff); // TODO Remove

    saveConfiguration(config);
}

void waitForSerial2ToReceive(const char* pattern, String& returnInput) {
    while (true) {
        while (Serial2.available() == 0) {
            delay(100); // Wait for input
        }
        returnInput = Serial2.readStringUntil('\n');
        if (returnInput.startsWith(pattern)) {
            break; // Exit the loop if the correct input is received
        }
    }
}

void resetDevice() {
    EEPROM.put(0, 0); // Reset Marker Value
    esp_restart();
}

void clearConfig() {
  EEPROM.begin(sizeof(CONFIG_MARKER)); // Reserve space for configuration, flag, and marker
  EEPROM.put(0, 0); // Reset Marker Value
  EEPROM.end();
}

void changeOperationModeStandby() {
    waitingTime = 5000;
}

void changeOperationModeActive() {
    waitingTime = 1000;
}

bool receiveWifiStatusFromWifiEsp() {
    String buff;
    waitForSerial2ToReceive("WiFi", buff);
    if (buff.startsWith("WiFi Connected")) {
        return true;
    } 
    return false;
}