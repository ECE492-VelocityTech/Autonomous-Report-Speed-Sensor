#include "speedUtil.h"

void getSpeedData(NTPClient& timeClient, String& currYear, String& currMonth, String& currDay)
{
    // Read input from serial with timeout
    String input;
    while (Serial2.available() == 0)
    {
        delay(100); // Wait for input
    }
    input = Serial2.readStringUntil('\n');

    // Check if input is a valid float
    float speed = 0.0;
    if (input.toFloat() != 0.0 || input.equals("0.0"))
    {                            // Check if input is a valid float or "0.0"
        speed = input.toFloat(); // Convert input string to float

        // Update speed array and timestamp array
        if (speedIndex < 10)
        {
            speeds[speedIndex] = speed;
            timestamps[speedIndex] = getTimestamp(timeClient, currYear, currMonth, currDay); // Update timestamp for the current index
            speedIndex++;
        }

        // Check if the speed array is full
        if (speedIndex == 10)
        {
            Serial.println("**Sending Speed Data**");
            // addTrafficData(); // Call function to add traffic data
            speedIndex = 0;   // Reset speed index
        }
    }
    else
    {
        Serial.println("Invalid input: " + input); // Print error message for invalid input
    }
}

String getTimestamp(NTPClient& timeClient, String& currYear, String& currMonth, String& currDay) {
  timeClient.update(); // Update time from NTP server

  String timestamp = currYear + "-" + currMonth + "-" + currDay + "T" + timeClient.getFormattedTime(); // Get formatted time

  return timestamp;
}