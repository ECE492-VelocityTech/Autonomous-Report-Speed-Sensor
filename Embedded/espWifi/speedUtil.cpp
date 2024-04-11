#include "speedUtil.h"

void getSpeedData(NTPClient &timeClient, WifiUtil &wifiUtil, const Configuration &config, String &currYear, String &currMonth, String &currDay)
{
    // Read input from serial with timeout
    String input;
    while (Serial2.available() == 0)
    {
        delay(100); // Wait for input
    }
    input = Serial2.readStringUntil('\n');
    Serial.print("**Received Speed: ");
    Serial.println(input);

    // Check if input is a valid float
    float speed = 0.0;
    if (input.toFloat() != 0.0 || input.equals("0.0"))
    {                            // Check if input is a valid float or "0.0"
        speed = input.toFloat(); // Convert input string to float

        // Update speed array and timestamp array
        if (speedIndex <= 10)
        {
            speeds[speedIndex] = speed;
            timestamps[speedIndex] = getTimestamp(timeClient, currYear, currMonth, currDay); // Update timestamp for the current index
            epochTimes[speedIndex] = timeClient.getEpochTime();
            speedIndex++;
        }
        else
        {
            Serial.println("**Sending Speed Data**");
            PostSpeedData(wifiUtil, config);
            // addTrafficData(); // Call function to add traffic data
        }
    }
    else
    {
        Serial.println("Invalid input: " + input); // Print error message for invalid input
    }
}

void aggregateSpeedData()
{
    aggrSpeedIndex = 0;
    float currentSpeed = speeds[0];
    unsigned long currentTimestamp = epochTimes[0];
    String *currentTimestampStr = &timestamps[0];

    for (size_t i = 1; i < speedIndex; ++i)
    {
        // Calculate the difference in time in seconds
        unsigned long timeDiff = epochTimes[i] - currentTimestamp;

        if ((speeds[i] <= currentSpeed * 1.1 && speeds[i] >= currentSpeed * 0.9) && timeDiff <= 5)
        {
            // If conditions met, update current timestamp
            currentTimestamp = epochTimes[i];
            currentTimestampStr = &timestamps[i];
        }
        else
        {
            // If conditions not met, aggregate previous values and start new aggregation
            aggrSpeeds[aggrSpeedIndex] = currentSpeed;
            aggrTimestamps[aggrSpeedIndex] = *currentTimestampStr;
            aggrSpeedIndex++;
            currentSpeed = speeds[i];
            currentTimestamp = epochTimes[i];
            currentTimestampStr = &timestamps[i];
        }
    }

    // Add the last aggregation
    aggrSpeeds[aggrSpeedIndex] = currentSpeed;
    aggrTimestamps[aggrSpeedIndex] = *currentTimestampStr;
    aggrSpeedIndex++;
    Serial.print("Aggregation: ");
    Serial.print(speedIndex);
    Serial.print(" : ");
    Serial.println(aggrSpeedIndex);
}

void PostSpeedData(WifiUtil &wifiUtil, const Configuration &config)
{
    aggregateSpeedData();
    String resp = wifiUtil.sendSpeedDataBatch(config);
    speedIndex = 0; // Reset speed index
}


String getTimestamp(NTPClient &timeClient, String &currYear, String &currMonth, String &currDay)
{
    timeClient.update(); // Update time from NTP server

    String timestamp = currYear + "-" + currMonth + "-" + currDay + "T" + timeClient.getFormattedTime(); // Get formatted time

    return timestamp;
}