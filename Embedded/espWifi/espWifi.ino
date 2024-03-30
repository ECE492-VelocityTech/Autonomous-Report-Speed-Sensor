const char* ssid = "Meharpreet's iPhone";
const char* password = "123456789";

/**
 * 1. Determine if it has the config
 * 2. If no config then wait to receive config from other controller
 * 3. If has config then start receiving the values from arduiono
 * 4. Send the values over to the server
*/

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Your code here
}