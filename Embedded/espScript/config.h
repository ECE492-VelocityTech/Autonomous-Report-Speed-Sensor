#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <esp_system.h>

const uint32_t CONFIG_MARKER = 0xABCDDCDA;

extern int waitingTime;

struct Configuration {
  String deviceName;
  String wifiName;
  String wifiPassword;
  long deviceId;
};

void saveConfiguration(const Configuration& config);
bool loadConfiguration(Configuration& config);

void sendConfigToWifiEsp(const Configuration& config);

bool receiveWifiStatusFromWifiEsp();

void resetDevice();

void clearConfig();

void changeOperationModeActive();

void changeOperationModeStandby();

void receiveCommandsFromWifiEsp();

void waitForSerial2ToReceive(const char* pattern, String& returnInput);

#endif // CONFIG_H