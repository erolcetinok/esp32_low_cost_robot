# ESP32 Low Cost Robot

This repository contains:
- `firmware/`: ESP32 firmware for TB6612 dual-motor control with serial + BLE command input.
- `web-controller/`: React + TypeScript Web Bluetooth controller UI.
- `docs/`: wiring, protocol, bring-up, and stability guides.

## Quick Start

## Firmware
1. Open `firmware/` in PlatformIO (or port to Arduino IDE).
2. Build and flash to ESP32 DevKit V1.
3. Open serial at `115200`.
4. Send `SAFE_OFF` before motion commands.

## Web Controller
1. `cd web-controller`
2. `npm install`
3. `npm run dev`
4. Open app in a Chromium browser with Web Bluetooth support.

## Command Protocol
- `F:<0-255>`, `B:<0-255>`, `L:<0-255>`, `R:<0-255>`
- `S`, `SAFE_ON`, `SAFE_OFF`, `PING`, `HELP`
