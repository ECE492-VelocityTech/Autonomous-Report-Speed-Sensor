#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <esp_system.h>

const uint32_t CONFIG_MARKER = 0xABCDDCDA;

struct Configuration {
  String deviceName;
  String wifiName;
  String wifiPassword;
  long deviceId;
};

void saveConfiguration(const Configuration& config);
bool loadConfiguration(Configuration& config);

void sendConfigToWifiEsp(const Configuration& config);

void resetDevice();
void listenToWifiEsp();

// String readFromESPWifi() {

// }

#endif // CONFIG_H