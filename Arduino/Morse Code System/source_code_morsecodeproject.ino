#include <SoftwareSerial.h>

SoftwareSerial HM10(10, 11); // HM10 TXD -> D10, HM10 RXD -> D11

const int BUTTON = 3;
const int LED = 9;
const int BUZZER = 8;

String buttonMorse = "";
String phoneMorse = "";

unsigned long lastPressTime = 0;

const int DOT_LIMIT = 400;
const int LETTER_GAP = 1000;

void beep(int duration) {
  digitalWrite(LED, HIGH);
  digitalWrite(BUZZER, HIGH);
  delay(duration);
  digitalWrite(LED, LOW);
  digitalWrite(BUZZER, LOW);
  delay(150);
}

void playMorse(String morse) {
  for (int i = 0; i < morse.length(); i++) {
    if (morse[i] == '.') beep(150);
    if (morse[i] == '-') beep(450);
  }
  delay(500);
}

String getMorse(char c) {
  c = toupper(c);

  if (c == 'A') return ".-";
  if (c == 'B') return "-...";
  if (c == 'C') return "-.-.";
  if (c == 'D') return "-..";
  if (c == 'E') return ".";
  if (c == 'F') return "..-.";
  if (c == 'G') return "--.";
  if (c == 'H') return "....";
  if (c == 'I') return "..";
  if (c == 'J') return ".---";
  if (c == 'K') return "-.-";
  if (c == 'L') return ".-..";
  if (c == 'M') return "--";
  if (c == 'N') return "-.";
  if (c == 'O') return "---";
  if (c == 'P') return ".--.";
  if (c == 'Q') return "--.-";
  if (c == 'R') return ".-.";
  if (c == 'S') return "...";
  if (c == 'T') return "-";
  if (c == 'U') return "..-";
  if (c == 'V') return "...-";
  if (c == 'W') return ".--";
  if (c == 'X') return "-..-";
  if (c == 'Y') return "-.--";
  if (c == 'Z') return "--..";

  if (c == '0') return "-----";
  if (c == '1') return ".----";
  if (c == '2') return "..---";
  if (c == '3') return "...--";
  if (c == '4') return "....-";
  if (c == '5') return ".....";
  if (c == '6') return "-....";
  if (c == '7') return "--...";
  if (c == '8') return "---..";
  if (c == '9') return "----.";

  return "";
}

char decodeMorse(String code) {
  if (code == ".-") return 'A';
  if (code == "-...") return 'B';
  if (code == "-.-.") return 'C';
  if (code == "-..") return 'D';
  if (code == ".") return 'E';
  if (code == "..-.") return 'F';
  if (code == "--.") return 'G';
  if (code == "....") return 'H';
  if (code == "..") return 'I';
  if (code == ".---") return 'J';
  if (code == "-.-") return 'K';
  if (code == ".-..") return 'L';
  if (code == "--") return 'M';
  if (code == "-.") return 'N';
  if (code == "---") return 'O';
  if (code == ".--.") return 'P';
  if (code == "--.-") return 'Q';
  if (code == ".-.") return 'R';
  if (code == "...") return 'S';
  if (code == "-") return 'T';
  if (code == "..-") return 'U';
  if (code == "...-") return 'V';
  if (code == ".--") return 'W';
  if (code == "-..-") return 'X';
  if (code == "-.--") return 'Y';
  if (code == "--..") return 'Z';

  if (code == "-----") return '0';
  if (code == ".----") return '1';
  if (code == "..---") return '2';
  if (code == "...--") return '3';
  if (code == "....-") return '4';
  if (code == ".....") return '5';
  if (code == "-....") return '6';
  if (code == "--...") return '7';
  if (code == "---..") return '8';
  if (code == "----.") return '9';

  return '?';
}

void processCharacter(char c, String source) {
  if (c == '\n' || c == '\r') return;

  if (c == '.' || c == '-') {
    phoneMorse += c;

    Serial.print(source);
    Serial.print(" Morse building: ");
    Serial.println(phoneMorse);

    return;
  }

  if (c == '#') {
    char decoded = decodeMorse(phoneMorse);

    Serial.print(source);
    Serial.print(" Morse: ");
    Serial.print(phoneMorse);
    Serial.print("  Decoded: ");
    Serial.println(decoded);

    phoneMorse = "";
    return;
  }

  String morse = getMorse(c);

  if (morse.length() > 0) {
    Serial.print(source);
    Serial.print(" Input: ");
    Serial.print(c);
    Serial.print("  Morse: ");
    Serial.println(morse);

    playMorse(morse);
  }
}

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  digitalWrite(LED, LOW);
  digitalWrite(BUZZER, LOW);

  Serial.begin(9600);
  HM10.begin(9600);

  Serial.println("Final Wireless Morse System Ready");
  Serial.println("Send A-Z/0-9 to play Morse.");
  Serial.println("Send Morse with # at end, e.g. .-# = A");
}

void loop() {
  while (HM10.available()) {
    char c = HM10.read();
    processCharacter(c, "Phone");
  }

  while (Serial.available()) {
    char c = Serial.read();
    processCharacter(c, "Laptop");
  }

  if (digitalRead(BUTTON) == LOW) {
    delay(80);

    if (digitalRead(BUTTON) == LOW) {
      unsigned long startTime = millis();

      while (digitalRead(BUTTON) == LOW) {
      }

      delay(80);

      unsigned long pressDuration = millis() - startTime;

      if (pressDuration < DOT_LIMIT) {
        buttonMorse += ".";
        Serial.println("Button: DOT .");
        beep(150);
      } else {
        buttonMorse += "-";
        Serial.println("Button: DASH -");
        beep(450);
      }

      lastPressTime = millis();
      delay(150);
    }
  }

  if (buttonMorse.length() > 0 && millis() - lastPressTime > LETTER_GAP) {
    char result = decodeMorse(buttonMorse);

    Serial.print("Button Morse: ");
    Serial.print(buttonMorse);
    Serial.print("  Decoded: ");
    Serial.println(result);

    buttonMorse = "";
  }
}
