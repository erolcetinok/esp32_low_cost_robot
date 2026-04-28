# Wiring

Fixed hardware wiring used by this project:

## ESP32 -> TB6612FNG
- AIN1 -> GPIO 26
- AIN2 -> GPIO 27
- PWMA -> GPIO 25
- BIN1 -> GPIO 33
- BIN2 -> GPIO 32
- PWMB -> GPIO 14
- STBY -> GPIO 12
- VCC -> ESP32 3.3V
- GND -> common GND

## Motors
- Left motor -> A01/A02
- Right motor -> B01/B02

## Power
- 9V battery (+) -> switch -> ESP32 VIN + TB6612 VM
- 9V battery (-) -> ESP32 GND + TB6612 GND
