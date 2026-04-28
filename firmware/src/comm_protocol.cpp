#include "comm_protocol.h"

namespace {

String normalize(String s) {
  s.trim();
  s.toUpperCase();
  return s;
}

}  // namespace

ParsedCommand CommProtocol::parse(const String& line) const {
  ParsedCommand out;
  String cmd = normalize(line);
  if (!cmd.length()) return out;

  if (cmd == "S" || cmd == "STOP") {
    out.valid = true;
    out.opcode = "S";
    return out;
  }
  if (cmd == "SAFE_ON" || cmd == "STBY_ON") {
    out.valid = true;
    out.opcode = "SAFE_ON";
    return out;
  }
  if (cmd == "SAFE_OFF" || cmd == "STBY_OFF") {
    out.valid = true;
    out.opcode = "SAFE_OFF";
    return out;
  }
  if (cmd == "PING") {
    out.valid = true;
    out.opcode = "PING";
    return out;
  }
  if (cmd == "HELP") {
    out.valid = true;
    out.opcode = "HELP";
    return out;
  }

  int colon = cmd.indexOf(':');
  if (colon <= 0 || colon >= (int)cmd.length() - 1) return out;
  String op = cmd.substring(0, colon);
  String val = cmd.substring(colon + 1);
  int speed = constrain(val.toInt(), 0, 255);
  if (!(op == "F" || op == "B" || op == "L" || op == "R")) return out;

  out.valid = true;
  out.opcode = op;
  out.value = speed;
  return out;
}
