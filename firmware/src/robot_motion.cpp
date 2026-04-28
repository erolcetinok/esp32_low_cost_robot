#include "robot_motion.h"

void RobotMotion::forward(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  drive(s, s);
}

void RobotMotion::backward(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  drive(-s, -s);
}

void RobotMotion::leftInPlace(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  drive(-s, s);
}

void RobotMotion::rightInPlace(uint8_t speed) {
  int16_t s = constrain((int16_t)speed, 0, 255);
  drive(s, -s);
}

void RobotMotion::drive(int16_t left, int16_t right) { driver_.setTargetSpeeds(left, right); }

void RobotMotion::stop() { driver_.setTargetSpeeds(0, 0); }
