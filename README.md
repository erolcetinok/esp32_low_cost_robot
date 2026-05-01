# ESP32 Low Cost Robot

Classroom-friendly ESP32 2-wheel robot project with:
- `firmware/` for ESP32 motor + safety control
- `web-controller/` for browser-based Bluetooth driving
- `docs/` for setup and troubleshooting

## Start Here

Read `docs/setup_guide.md` for the complete beginner setup path.

If you only want the short version:

1. Flash firmware from `firmware/` to ESP32.
2. Start web app:
   - `cd web-controller`
   - `npm install`
   - `npm run dev`
3. Open the shown local URL in Chrome/Edge, then open **Blockly Studio** at `/studio` (or use **Home → Open Blockly Studio**).
4. In Studio, click Connect.
5. Click `Enable Driving` (motors arm).
6. Build a simple Blockly program and click `Run Program`.
7. Click `Disable Driving` when done.

## Safety Rules

- Robot boots in protected mode (motors disabled).
- You must explicitly enable driving before movement.
- If commands stop, firmware watchdog auto-stops the robot.
- Use simulator mode first when hardware is not available.

## Important Docs

- `docs/setup_guide.md` - full step-by-step setup
- `docs/bringup.md` - quick technical bring-up
- `docs/firmware_stability_checklist.md` - reliability validation
- `docs/bluetooth_protocol.md` - command protocol details
