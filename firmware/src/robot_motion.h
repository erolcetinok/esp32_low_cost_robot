#pragma once

#include <Arduino.h>

#include "motor_driver.h"

class RobotMotion {
 public:
  explicit RobotMotion(MotorDriver& driver) : driver_(driver) {}

  void forward(uint8_t speed);
  void backward(uint8_t speed);
  void leftInPlace(uint8_t speed);
  void rightInPlace(uint8_t speed);
  void drive(int16_t left, int16_t right);
  void stop();

 private:
  MotorDriver& driver_;
};
