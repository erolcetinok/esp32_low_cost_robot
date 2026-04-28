/*
 * ESP32 + TB6612FNG dual DC motor control (TT motors)
 *
 * Wiring (your setup):
 *   AIN1=26, AIN2=27, PWMA=25  -> left motor (A01/A02)
 *   BIN1=33, BIN2=32, PWMB=14  -> right motor (B01/B02)
 *   STBY=12
 *
 * PWM: ESP32 Arduino uses LEDC (not AVR-style analogWrite semantics).
 * Core 3.x: ledcAttach(pin, freq, res) + ledcWrite(pin, duty).
 * Core 2.x: ledcSetup(channel) + ledcAttachPin + ledcWrite(channel, duty).
 *
 * Power note: if USB/Serial dies when 9 V is connected, the battery + motors are
 * sagging the rail or bouncing ground (brownout). Use a beefier pack, short thick
 * wires, 100–470 µF + 0.1 µF across VM/GND at the TB6612, and tie all GNDs at one
 * point. See STARTUP_QUIET_MS below to open Serial before the driver enables.
 */

#include <Arduino.h>

// USB can enumerate while 9 V is off; after you turn 9 V on, keep the TB6612 in
// standby for this many ms so Serial Monitor can connect before any motor current.
#ifndef STARTUP_QUIET_MS
#define STARTUP_QUIET_MS 8000
#endif

// Lower this first if the supply browns out when motors move (default was 180).
#ifndef DEMO_SPEED
#define DEMO_SPEED 80
#endif

// --- Pin map (TB6612 control) ---
static const uint8_t PIN_AIN1 = 26;
static const uint8_t PIN_AIN2 = 27;
static const uint8_t PIN_PWMA = 25;
static const uint8_t PIN_BIN1 = 33;
static const uint8_t PIN_BIN2 = 32;
static const uint8_t PIN_PWMB = 14;
static const uint8_t PIN_STBY = 12;

// If a wheel runs backward when you command forward, set its invert flag to 1 (no rewiring needed).
#ifndef MOTOR_INVERT_LEFT
#define MOTOR_INVERT_LEFT 0
#endif
#ifndef MOTOR_INVERT_RIGHT
#define MOTOR_INVERT_RIGHT 0
#endif

// PWM: 20 kHz is a good default for motor drivers (often quieter than 1–5 kHz).
static const uint32_t MOTOR_PWM_HZ = 20000;
static const uint8_t MOTOR_PWM_BITS = 8; // duty 0 … 255

#if defined(ESP_ARDUINO_VERSION) && (ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0))
#define MOTOR_LEDC_API_V3 1
#else
#define MOTOR_LEDC_API_V3 0
#endif

#if !MOTOR_LEDC_API_V3
static const uint8_t PWMA_CH = 0;
static const uint8_t PWMB_CH = 1;
#endif

static uint16_t pwmMaxDuty() {
  return (1u << MOTOR_PWM_BITS) - 1u;
}

static void motorPwmInit() {
#if MOTOR_LEDC_API_V3
  ledcAttach(PIN_PWMA, MOTOR_PWM_HZ, MOTOR_PWM_BITS);
  ledcAttach(PIN_PWMB, MOTOR_PWM_HZ, MOTOR_PWM_BITS);
#else
  ledcSetup(PWMA_CH, MOTOR_PWM_HZ, MOTOR_PWM_BITS);
  ledcSetup(PWMB_CH, MOTOR_PWM_HZ, MOTOR_PWM_BITS);
  ledcAttachPin(PIN_PWMA, PWMA_CH);
  ledcAttachPin(PIN_PWMB, PWMB_CH);
#endif
}

static void motorPwmWriteLeft(uint32_t duty) {
#if MOTOR_LEDC_API_V3
  ledcWrite(PIN_PWMA, duty);
#else
  ledcWrite(PWMA_CH, duty);
#endif
}

static void motorPwmWriteRight(uint32_t duty) {
#if MOTOR_LEDC_API_V3
  ledcWrite(PIN_PWMB, duty);
#else
  ledcWrite(PWMB_CH, duty);
#endif
}

/** Set one motor: speed in range [-255, 255]. Negative = reverse. */
static void setMotorChannel(uint8_t in1, uint8_t in2, void (*pwmWrite)(uint32_t), int16_t speed) {
  const uint16_t maxD = pwmMaxDuty();
  int16_t s = constrain(speed, -255, 255);

  if (s == 0) {
    // TB6612: IN1=LOW, IN2=LOW -> outputs off (coast). Good for "stop" with low current.
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
    pwmWrite(0);
    return;
  }

  uint32_t duty = (uint32_t)abs(s) * maxD / 255u;
  if (s > 0) {
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
  }
  pwmWrite(duty);
}

void setLeftMotor(int16_t speed) {
#if MOTOR_INVERT_LEFT
  speed = (int16_t)-speed;
#endif
  setMotorChannel(PIN_AIN1, PIN_AIN2, motorPwmWriteLeft, speed);
}

void setRightMotor(int16_t speed) {
#if MOTOR_INVERT_RIGHT
  speed = (int16_t)-speed;
#endif
  setMotorChannel(PIN_BIN1, PIN_BIN2, motorPwmWriteRight, speed);
}

/** Tank drive: left and right wheel speeds [-255, 255]. */
void setDrive(int16_t left, int16_t right) {
  setLeftMotor(left);
  setRightMotor(right);
}

void motorStandby(bool standby) {
  // STBY LOW -> driver sleep; HIGH -> run
  digitalWrite(PIN_STBY, standby ? LOW : HIGH);
}

void motorsStop() {
  setDrive(0, 0);
}

// --- Simple motion helpers (adjust signs if a wheel runs backward mechanically) ---
void driveForward(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  setDrive(s, s);
}

void driveBackward(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  setDrive(-s, -s);
}

void turnLeftInPlace(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  setDrive(-s, s);
}

void turnRightInPlace(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  setDrive(s, -s);
}

void setup() {
  Serial.begin(115200);
  delay(400);

  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_BIN1, OUTPUT);
  pinMode(PIN_BIN2, OUTPUT);
  pinMode(PIN_STBY, OUTPUT);

  // Keep TB6612 in standby until countdown finishes (reduces load/noise during USB bring-up).
  digitalWrite(PIN_STBY, LOW);

  motorPwmInit();
  motorsStop();

  Serial.println();
  Serial.println("ESP32 TB6612 motor test");
  Serial.println("Steps: (1) USB plugged in (2) turn 9 V ON (3) open Serial Monitor 115200");
  Serial.println("Motor driver stays STBY=LOW during countdown — connect Serial now.");
#if STARTUP_QUIET_MS > 0
  {
    uint32_t remain = STARTUP_QUIET_MS;
    while (remain > 0) {
      uint32_t step = remain > 1000 ? 1000 : remain;
      Serial.print("  ... driver enable in ");
      Serial.print((remain + 999) / 1000);
      Serial.println(" s");
      delay(step);
      remain -= step;
    }
  }
#endif

  motorStandby(false);
  Serial.println("STBY=HIGH — demo starting. If USB drops here, fix power/ground (see header).");
}

void loop() {
  const uint8_t spd = DEMO_SPEED;

  Serial.println("FORWARD");
  driveForward(spd);
  delay(2000);

  Serial.println("STOP");
  motorsStop();
  delay(500);

  Serial.println("BACKWARD");
  driveBackward(spd);
  delay(2000);

  Serial.println("STOP");
  motorsStop();
  delay(500);

  Serial.println("TURN LEFT (in place)");
  turnLeftInPlace(spd);
  delay(1500);

  Serial.println("STOP");
  motorsStop();
  delay(500);

  Serial.println("TURN RIGHT (in place)");
  turnRightInPlace(spd);
  delay(1500);

  Serial.println("STOP");
  motorsStop();
  delay(1500);
}
