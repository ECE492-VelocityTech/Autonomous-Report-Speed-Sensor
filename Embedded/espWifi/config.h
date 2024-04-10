#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

const uint32_t CONFIG_MARKER = 0xABCDDCDA;
const int RESET_THRESHOLD = 10000;

extern const int GREEN_LED;

struct Configuration {
  String deviceName;
  String wifiName;
  String wifiPassword;
  String address;
  long deviceId;
};

enum class DeviceStatus
{
    Active,
    Standby,
    Test
};

extern DeviceStatus deviceStatus;

void saveConfiguration(const Configuration& config);
bool loadConfiguration(Configuration& config);

void receiveConfigFromBleEsp(Configuration& config);

void sendWifiStatusToBleEsp(bool connectionSuccess);

bool isResetRequested(const int& buttonPin);

void clearConfig();

void resetDevice();

void parseServerResp(String& resp);

#endif // CONFIG_H