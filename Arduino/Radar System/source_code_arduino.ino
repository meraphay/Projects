#include <Servo.h>

const int trigPin = 10;
const int echoPin = 11;
const int buzzerPin = 9;

const int MIN_DISTANCE = 35;  // Minimum distance for alarm (cm)
const int DEBOUNCE_DELAY = 50; // Delay to stabilize readings
const int SERVO_DELAY = 30;   // Increased delay for servo movement

long duration;
int distance;
Servo myServo;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

  Serial.begin(9600);
  myServo.attach(12);
  digitalWrite(buzzerPin, LOW); // Ensure buzzer is off initially
}

void loop() {
  // Sweep from 0° to 180°
  for (int i = 0; i <= 180; i++) {
    myServo.write(i);
    delay(SERVO_DELAY);  // Increased delay for servo to settle
    distance = getFilteredDistance();
    Serial.print(i);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(".");
    beepIfClose(distance);
  }

  // Sweep back from 180° to 0°
  for (int i = 180; i >= 0; i--) {
    myServo.write(i);
    delay(SERVO_DELAY);  // Increased delay for servo to settle
    distance = getFilteredDistance();
    Serial.print(i);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(".");
    beepIfClose(distance);
  }
}

// Get filtered distance with multiple samples
int getFilteredDistance() {
  int samples[3];
  for (int i = 0; i < 3; i++) {
    samples[i] = calculateDistance();
    delay(10); // Small delay between samples
  }
  
  // Return the median value to filter outliers
  return (samples[0] + samples[1] + samples[2]) / 3; // Simple average
}

int calculateDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(4); // Slightly longer than minimum

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH, 30000);  // 30ms timeout (~5m max distance)
  distance = duration * 0.034 / 2;
  
  // Return max distance if timeout occurs
  if (duration == 0) return 500; 
  return distance;
}

void beepIfClose(int dist) {
  static unsigned long lastBeepTime = 0;
  
  if (dist <= MIN_DISTANCE && dist > 0) {  // Also check for dist > 0 to filter bad readings
    int beepDelay = map(dist, 0, MIN_DISTANCE, 50, 200);
    beepDelay = constrain(beepDelay, 50, 200);
    
    // Only beep if enough time has passed since last beep
    if (millis() - lastBeepTime >= beepDelay * 2) {
      digitalWrite(buzzerPin, HIGH);
      delay(beepDelay / 2); // Shorter beep duration
      digitalWrite(buzzerPin, LOW);
      lastBeepTime = millis();
    }
  }
}
