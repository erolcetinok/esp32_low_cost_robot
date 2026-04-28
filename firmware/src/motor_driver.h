#pragma once

#include <Arduino.h>

class MotorDriver {
 public:
  void begin();
  void setStandby(bool standby);
  bool isStandby() const;
  void setTargetSpeeds(int16_t left, int16_t right);
  void updateRamp();
  void stop();

 private:
  bool standby_ = true;
  int16_t currentLeft_ = 0;
  int16_t currentRight_ = 0;
  int16_t targetLeft_ = 0;
  int16_t targetRight_ = 0;
  uint32_t lastRampMs_ = 0;

  void setMotorChannel(uint8_t in1, uint8_t in2, uint8_t pwmPin, int16_t speed);
  void applyNow();
  int16_t nextRampStep(int16_t current, int16_t target) const;
};
