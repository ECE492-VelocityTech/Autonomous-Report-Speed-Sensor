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
    String input;
    Serial.println("Sync ESPS");

    while (true) {
        while (Serial2.available() == 0) {
            delay(1000); // Wait for input
            Serial.println("Waiting");
        }
        input = Serial2.readStringUntil('\n');
        if (input.startsWith("Ready to receive data")) {
            break; // Exit the loop if the correct input is received
        }
    }
    Serial.println("Received INIT");
    // send Wifi Cred
    input = config.wifiName + "\n" + config.wifiPassword + "\n";
    input.concat(config.deviceId);
    // input = "Mehar iPhone\n123456789\n17";
    // input += String(config.deviceId);
    Serial.println("Sent to ESPWIFI: " + input); // TODO Remove
    Serial2.println(input);
    while (true) {
        while (Serial2.available() == 0) {
            delay(100); // Wait for input
        }
        input = Serial2.readStringUntil('\n');
        if (input.startsWith("ACK")) {
            break; // Exit the loop if the correct input is received
        }
    }
    Serial.println("Received " + input); // TODO Remove
}

void resetDevice() {
    EEPROM.put(0, 0); // Reset Marker Value
    esp_restart();
}