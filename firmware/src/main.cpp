#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <esp_system.h>

#include "comm_protocol.h"
#include "config.h"
#include "motor_driver.h"
#include "robot_motion.h"

namespace {

const char* kBleName = "ESP32-Robot";
const char* kServiceUuid = "19b10000-e8f2-537e-4f6c-d104768a1214";
const char* kCmdUuid = "19b10001-e8f2-537e-4f6c-d104768a1214";
const char* kStatusUuid = "19b10002-e8f2-537e-4f6c-d104768a1214";

MotorDriver motorDriver;
RobotMotion robotMotion(motorDriver);
CommProtocol protocol;

BLECharacteristic* statusChar = nullptr;
String serialLine;
bool bleConnected = false;
uint32_t lastCommandMs = 0;
bool safeMode = true;

void publishStatus(const String& text) {
  Serial.println(text);
  if (statusChar) {
    statusChar->setValue(text.c_str());
    statusChar->notify();
  }
}

void printHelp() {
  publishStatus("Commands: F:<0-255>, B:<0-255>, L:<0-255>, R:<0-255>, S, SAFE_ON, SAFE_OFF, PING, HELP");
}

void applyCommand(const ParsedCommand& cmd, const char* source) {
  if (!cmd.valid) {
    publishStatus(String("[") + source + "] NACK");
    return;
  }

  if (cmd.opcode == "PING") {
    publishStatus(String("[") + source + "] PONG");
    return;
  }
  if (cmd.opcode == "HELP") {
    printHelp();
    return;
  }
  if (cmd.opcode == "SAFE_ON") {
    safeMode = true;
    motorDriver.stop();
    motorDriver.setStandby(true);
    publishStatus(String("[") + source + "] SAFE_ON");
    return;
  }
  if (cmd.opcode == "SAFE_OFF") {
    safeMode = false;
    motorDriver.setStandby(false);
    publishStatus(String("[") + source + "] SAFE_OFF");
    return;
  }

  if (safeMode || motorDriver.isStandby()) {
    publishStatus(String("[") + source + "] SAFE_MODE_BLOCK");
    return;
  }

  if (cmd.opcode == "S") {
    robotMotion.stop();
    publishStatus(String("[") + source + "] OK STOP");
  } else if (cmd.opcode == "F") {
    robotMotion.forward((uint8_t)cmd.value);
    publishStatus(String("[") + source + "] OK FORWARD");
  } else if (cmd.opcode == "B") {
    robotMotion.backward((uint8_t)cmd.value);
    publishStatus(String("[") + source + "] OK BACKWARD");
  } else if (cmd.opcode == "L") {
    robotMotion.leftInPlace((uint8_t)cmd.value);
    publishStatus(String("[") + source + "] OK LEFT");
  } else if (cmd.opcode == "R") {
    robotMotion.rightInPlace((uint8_t)cmd.value);
    publishStatus(String("[") + source + "] OK RIGHT");
  }

  lastCommandMs = millis();
}

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) override {
    bleConnected = true;
    (void)pServer;
    publishStatus("[BLE] CONNECTED");
  }
  void onDisconnect(BLEServer* pServer) override {
    bleConnected = false;
    robotMotion.stop();
    lastCommandMs = 0;
    pServer->startAdvertising();
    publishStatus("[BLE] DISCONNECTED");
  }
};

class CommandCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* characteristic) override {
    String input = characteristic->getValue().c_str();
    ParsedCommand cmd = protocol.parse(input);
    applyCommand(cmd, "BLE");
  }
};

void setupBle() {
  BLEDevice::init(kBleName);
  BLEServer* server = BLEDevice::createServer();
  server->setCallbacks(new ServerCallbacks());

  BLEService* service = server->createService(kServiceUuid);
  BLECharacteristic* cmdChar =
      service->createCharacteristic(kCmdUuid, BLECharacteristic::PROPERTY_WRITE);
  statusChar = service->createCharacteristic(
      kStatusUuid, BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_READ);
  statusChar->addDescriptor(new BLE2902());
  cmdChar->setCallbacks(new CommandCallbacks());

  service->start();
  BLEAdvertising* advertising = server->getAdvertising();
  advertising->addServiceUUID(kServiceUuid);
  advertising->start();
}

void processSerial() {
  while (Serial.available()) {
    char c = (char)Serial.read();
    if (c == '\n' || c == '\r') {
      if (serialLine.length() > 0) {
        String line = serialLine;
        line.trim();
        // Ignore blank lines (Enter alone, or terminal noise / whitespace-only).
        if (line.length() > 0) {
          ParsedCommand cmd = protocol.parse(serialLine);
          applyCommand(cmd, "SERIAL");
        }
      }
      serialLine = "";
    } else {
      serialLine += c;
    }
  }
}

void printResetInfo() {
  esp_reset_reason_t reason = esp_reset_reason();
  publishStatus(String("ResetReason: ") + (int)reason);
}

}  // namespace

void setup() {
  Serial.begin(config::SERIAL_BAUD);
  delay(400);

  motorDriver.begin();
  printResetInfo();

  publishStatus("ESP32 robot command mode");
  publishStatus("Startup quiet period active. Driver remains in standby.");
  uint32_t remain = config::STARTUP_QUIET_MS;
  while (remain > 0) {
    uint32_t step = remain > 1000 ? 1000 : remain;
    publishStatus(String("... safe mode in ") + String((remain + 999) / 1000) + "s");
    delay(step);
    remain -= step;
  }

  setupBle();
  printHelp();
  publishStatus("System ready. Send SAFE_OFF to arm motors.");
}

void loop() {
  processSerial();
  motorDriver.updateRamp();

  if (!safeMode && lastCommandMs > 0 && millis() - lastCommandMs > config::COMMAND_TIMEOUT_MS) {
    robotMotion.stop();
    lastCommandMs = 0;
    publishStatus("[WATCHDOG] COMMAND TIMEOUT -> STOP");
  }
}
