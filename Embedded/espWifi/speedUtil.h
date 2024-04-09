#ifndef SPEED_UTIL_H
#define SPEED_UTIL_H

#include <Arduino.h>
#include <NTPClient.h>

#include "wifiUtil.h"
#include "config.h"

extern float speeds[15]; // Array to store speeds
extern String timestamps[15]; // Array to store timestamps

extern float aggrSpeeds[15]; // Array to store speeds
extern String aggrTimestamps[15]; // Array to store timestamps
extern unsigned long epochTimes[15]; 

extern int speedIndex; // Index to keep track of the number of speeds stored
extern int aggrSpeedIndex; // Index to keep track of the number of speeds stored


void getSpeedData(NTPClient& timeClient, WifiUtil& wifiUtil, const Configuration& config, String& currYear, String& currMonth, String& currDay);

void PostSpeedData(WifiUtil& wifiUtil, const Configuration& config);

String getTimestamp(NTPClient& timeClient, String& currYear, String& currMonth, String& currDay);

void aggregateSpeedData(); // aggregates speed data when applicable

#endif // SPEED_UTIL_H

