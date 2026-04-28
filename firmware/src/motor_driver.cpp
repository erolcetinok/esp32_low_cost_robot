#include "motor_driver.h"

#include "config.h"
#include "pins.h"

namespace {

#if defined(ESP_ARDUINO_VERSION) && (ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0))
constexpr bool kLedcV3 = true;
#else
constexpr bool kLedcV3 = false;
constexpr uint8_t kPwmaChannel = 0;
constexpr uint8_t kPwmbChannel = 1;
#endif

uint16_t pwmMaxDuty() { return (1u << config::MOTOR_PWM_BITS) - 1u; }

void writePwm(uint8_t pin, uint8_t channel, uint32_t duty) {
#if defined(ESP_ARDUINO_VERSION) && (ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0))
  (void)channel;
  ledcWrite(pin, duty);
#else
  (void)pin;
  ledcWrite(channel, duty);
#endif
}

void attachPwm() {
  if (kLedcV3) {
    ledcAttach(pins::PWMA, config::MOTOR_PWM_HZ, config::MOTOR_PWM_BITS);
    ledcAttach(pins::PWMB, config::MOTOR_PWM_HZ, config::MOTOR_PWM_BITS);
  } else {
#if !(defined(ESP_ARDUINO_VERSION) && (ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)))
    ledcSetup(kPwmaChannel, config::MOTOR_PWM_HZ, config::MOTOR_PWM_BITS);
    ledcSetup(kPwmbChannel, config::MOTOR_PWM_HZ, config::MOTOR_PWM_BITS);
    ledcAttachPin(pins::PWMA, kPwmaChannel);
    ledcAttachPin(pins::PWMB, kPwmbChannel);
#endif
  }
}

}  // namespace

void MotorDriver::begin() {
  pinMode(pins::AIN1, OUTPUT);
  pinMode(pins::AIN2, OUTPUT);
  pinMode(pins::BIN1, OUTPUT);
  pinMode(pins::BIN2, OUTPUT);
  pinMode(pins::STBY, OUTPUT);
  attachPwm();
  stop();
  setStandby(true);
}

void MotorDriver::setStandby(bool standby) {
  standby_ = standby;
  digitalWrite(pins::STBY, standby ? LOW : HIGH);
  if (standby) {
    currentLeft_ = currentRight_ = targetLeft_ = targetRight_ = 0;
    applyNow();
  }
}

bool MotorDriver::isStandby() const { return standby_; }

void MotorDriver::setTargetSpeeds(int16_t left, int16_t right) {
  targetLeft_ = constrain(left, -255, 255);
  targetRight_ = constrain(right, -255, 255);
}

int16_t MotorDriver::nextRampStep(int16_t current, int16_t target) const {
  if (current == target) return current;
  int16_t step = config::RAMP_STEP;
  if (target > current) {
    return min<int16_t>(target, current + step);
  }
  return max<int16_t>(target, current - step);
}

void MotorDriver::updateRamp() {
  if (standby_) return;
  uint32_t now = millis();
  if (now - lastRampMs_ < config::RAMP_INTERVAL_MS) return;
  lastRampMs_ = now;

  int16_t nextLeft = nextRampStep(currentLeft_, targetLeft_);
  int16_t nextRight = nextRampStep(currentRight_, targetRight_);
  if (nextLeft == currentLeft_ && nextRight == currentRight_) return;
  currentLeft_ = nextLeft;
  currentRight_ = nextRight;
  applyNow();
}

void MotorDriver::setMotorChannel(uint8_t in1, uint8_t in2, uint8_t pwmPin, int16_t speed) {
  int16_t s = constrain(speed, -255, 255);
  if (s == 0) {
    digitalWrite(in1, LOW);
    digitalWrite(in2, LOW);
#if defined(ESP_ARDUINO_VERSION) && (ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0))
    writePwm(pwmPin, 0, 0);
#else
    writePwm(pwmPin, pwmPin == pins::PWMA ? kPwmaChannel : kPwmbChannel, 0);
#endif
    return;
  }

  const uint32_t duty = (uint32_t)abs(s) * pwmMaxDuty() / 255u;
  digitalWrite(in1, s > 0 ? HIGH : LOW);
  digitalWrite(in2, s > 0 ? LOW : HIGH);
#if defined(ESP_ARDUINO_VERSION) && (ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0))
  writePwm(pwmPin, 0, duty);
#else
  writePwm(pwmPin, pwmPin == pins::PWMA ? kPwmaChannel : kPwmbChannel, duty);
#endif
}

void MotorDriver::applyNow() {
  int16_t left = config::MOTOR_INVERT_LEFT ? -currentLeft_ : currentLeft_;
  int16_t right = config::MOTOR_INVERT_RIGHT ? -currentRight_ : currentRight_;
  setMotorChannel(pins::AIN1, pins::AIN2, pins::PWMA, left);
  setMotorChannel(pins::BIN1, pins::BIN2, pins::PWMB, right);
}

void MotorDriver::stop() {
  targetLeft_ = targetRight_ = 0;
  currentLeft_ = currentRight_ = 0;
  applyNow();
}
