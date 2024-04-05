#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

const uint32_t CONFIG_MARKER = 0xABCDDCDA;

struct Configuration {
  String deviceName;
  String wifiName;
  String wifiPassword;
  String address;
};

void saveConfiguration(const Configuration& config);
bool loadConfiguration(Configuration& config);

#endif // CONFIG_H