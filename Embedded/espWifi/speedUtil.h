#ifndef SPEED_UTIL_H
#define SPEED_UTIL_H

#include <Arduino.h>
#include <NTPClient.h>

extern float speeds[15]; // Array to store speeds
extern String timestamps[15]; // Array to store timestamps

extern int speedIndex; // Index to keep track of the number of speeds stored

void getSpeedData(NTPClient& timeClient, String& currYear, String& currMonth, String& currDay);

String getTimestamp(NTPClient& timeClient, String& currYear, String& currMonth, String& currDay);

#endif // SPEED_UTIL_H

