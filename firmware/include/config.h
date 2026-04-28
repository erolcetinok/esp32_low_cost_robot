#pragma once

#include <Arduino.h>

namespace config {

static const uint32_t SERIAL_BAUD = 115200;
static const uint32_t STARTUP_QUIET_MS = 8000;
static const uint8_t DEFAULT_SPEED = 80;

static const uint32_t MOTOR_PWM_HZ = 20000;
static const uint8_t MOTOR_PWM_BITS = 8;

static const bool MOTOR_INVERT_LEFT = false;
static const bool MOTOR_INVERT_RIGHT = false;

static const uint16_t COMMAND_TIMEOUT_MS = 1500;
static const uint8_t RAMP_STEP = 8;
static const uint16_t RAMP_INTERVAL_MS = 20;

}  // namespace config
