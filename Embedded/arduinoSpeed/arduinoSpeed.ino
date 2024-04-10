#define PIN_NUMBER 4
#define AVERAGE 4
#define MINIMUM_SPEED 10
#define MAXIMUM_SPEED 150.0

unsigned int doppler_div = 44;
unsigned int samples[AVERAGE];
unsigned int x;

void setup() {
  Serial.begin(9600);
  pinMode(PIN_NUMBER, INPUT);

  while (true) {
    while (Serial.available() == 0) {
      delay(100); // Wait for input
    }
    
    String input = Serial.readStringUntil('\n');
//    Serial.println("Input received: ");
//    Serial.println(input);
    
    // Check if input contains the specified string
    if (input.startsWith("Ready to receive speed data")) {
      break; // Exit the loop if the correct input is received
    } else {
      Serial.println("Wrong");
    }
  }

  // while(true){
  //   Serial.println("hi");
  // }
}

void loop() {  
  // Proceed with the rest of the code
  noInterrupts();
  pulseIn(PIN_NUMBER, HIGH);
  unsigned int pulse_length = 0;
  
  for (x = 0; x < AVERAGE; x++)
  {
    pulse_length = pulseIn(PIN_NUMBER, HIGH); 
    pulse_length += pulseIn(PIN_NUMBER, LOW);    
    samples[x] =  pulse_length;
  }
  interrupts();

  // Check for consistency
  bool samples_ok = true;
  unsigned int nbPulsesTime = samples[0];
  for (x = 1; x < AVERAGE; x++)
  {
    nbPulsesTime += samples[x];
    // Check if the sample is within Â±20% of the first sample
    if (samples[x] > samples[0] * 1.2 || samples[x] < samples[0] * 0.8)
    {
      samples_ok = false;
    }
  }

  if (samples_ok)
  {
    unsigned int Ttime = nbPulsesTime / AVERAGE;
    unsigned int Freq = 1000000 / Ttime;
    float speed = Freq / doppler_div;
    
    // Check if speed meets minimum threshold and send it to the server
    if (speed >= MINIMUM_SPEED && speed <= MAXIMUM_SPEED) {
      sendDataToServer(speed);
    }
  }
}

void sendDataToServer(float speed) {
  // Send speed data to server
  Serial.print(speed);
  Serial.print("\r\n");
}