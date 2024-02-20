#define LED_PIN 2  // Define the GPIO pin for the LED
#define RXD2 16
#define TXD2 17

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600,SERIAL_8N1,RXD2,TXD2);
}

void receiveSpeedData() {
  Serial.println(Serial2.readString());
}

void loop() {
  Serial.print("Data received:");
  receiveSpeedData();
  delay(200);
}
