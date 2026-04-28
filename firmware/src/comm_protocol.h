#pragma once

#include <Arduino.h>

struct ParsedCommand {
  bool valid = false;
  String opcode;
  int value = 0;
};

class CommProtocol {
 public:
  ParsedCommand parse(const String& line) const;
};
