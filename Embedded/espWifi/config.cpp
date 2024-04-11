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
    // Tell ESP_B to send config
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
    config.deviceId = input.toInt();

    Serial.println("ACK");

    saveConfiguration(config);
}

void sendWifiStatusToBleEsp(bool connectionSuccess) {
    if (connectionSuccess) {
        Serial.println("WiFi Connected");
    } else {
        Serial.println("WiFi Not Connected");
    }
}

bool isResetRequested(const int& buttonPin) {
    unsigned long buttonPressStartTime = 0;
    int buttonState;
    while (true) {
        buttonState = digitalRead(buttonPin);

        if (buttonState == LOW) {
            // Button is pressed
            if (buttonPressStartTime == 0) {
                // Start measuring time if it's the first time the button is pressed
                buttonPressStartTime = millis();
            }
        } else {
            // Button is released
            buttonPressStartTime = 0; // Reset the start time
            return false;
        }

        if (buttonPressStartTime != 0 && millis() - buttonPressStartTime >= RESET_THRESHOLD) {
            // Button has been pressed for Reset threshold (10s for eg)
            buttonPressStartTime = 0;
            Serial.println("Reset Requested");
            return true;
        }

        delay(1000); // Add a small delay to debounce the button (optional)
        Serial.println("Button Pressed");
    }
}

void clearConfig() {
    EEPROM.begin(sizeof(CONFIG_MARKER));
    EEPROM.put(0, 0); // Reset Marker Value
    EEPROM.end();
}

void resetDevice() {
    clearConfig();
    esp_restart();
}

void parseServerResp(String& resp) {
    Serial.print("Parsing parseServerResp");
    Serial.print(resp);
    if (resp == "Active") {
        deviceStatus = DeviceStatus::Active;
        Serial.println("Setting to Actice");
    } else if (resp == "Standby") {
        Serial.println("");
        deviceStatus = DeviceStatus::Standby;
        Serial.println("Setting to Standby");
    } else if (resp == "Test") {
        deviceStatus = DeviceStatus::Test;
        Serial.println("Setting to Test");
    }
}


void sendCommandToBleEsp(const String& command) {
    Serial.println(command);
}