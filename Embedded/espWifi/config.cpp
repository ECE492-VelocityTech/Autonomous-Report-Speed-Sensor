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
    } else {
        Serial.println("No config found"); // TODO: Remove
    }
    EEPROM.end();

    return configFound;
}

void receiveConfigFromBleEsp(Configuration& config) {
    // Tell ESPBle to send Ble
    Serial.println("Ready to receive data");
    while (Serial.available() == 0) {
        delay(100); // Wait for input
    }
    // wifiSSID
    String input = Serial.readStringUntil('\n');
    Serial.println(input);
    config.wifiName = input;
    // password
    input = Serial.readStringUntil('\n');
    config.wifiPassword = input;
    Serial.println(input);
    // deviceId
    input = Serial.readStringUntil('\n');
    Serial.println(input);
    config.deviceId = input;

    Serial.println("ACK");

    saveConfiguration(config);
}