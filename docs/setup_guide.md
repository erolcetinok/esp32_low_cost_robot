# Complete Setup Guide (Beginner Friendly)

This guide is written for teachers and students with minimal technical background.

## 1) What You Need

- ESP32 robot hardware already wired
- A USB cable from ESP32 to Mac
- A Mac with:
  - Chrome or Edge browser
  - Node.js installed (version 18+ recommended)
- This project folder on your computer

## 2) First-Time Firmware Upload

You only need to do this when firmware changes.

1. Open the `firmware/` folder in PlatformIO (VS Code extension).
2. Connect ESP32 over USB.
3. Click Build, then Upload.
4. Wait for success message.

If upload fails:
- Check USB cable (must support data, not charging-only).
- Close other serial monitor windows.
- Retry upload.

## 3) Start the Web Controller

1. Open Terminal.
2. Run:
   - `cd /Users/erolcetinok/Desktop/code/personal/esp32_low_cost_robot/web-controller`
   - `npm install` (first time only)
   - `npm run dev`
3. Open the local URL shown in Terminal (usually `http://localhost:5173`).
4. Keep this terminal open while using the controller.

## 4) Connect and Drive

1. Power the robot and keep USB connected.
2. In the web app, click `Connect`.
3. Select `ESP32-Robot` in the Bluetooth popup.
4. Click `Enable Driving`.
5. In each Blockly **move** block, use a moderate speed first (around 70–100), or add **set default speed** before moves.
6. In Blockly, stack a small program:
   - `enable driving`
   - `move forward`
   - `wait 500 ms`
   - `stop`
7. Click `Run Program`.
8. Click `Emergency Stop` whenever needed.
9. Click `Disable Driving` before ending session.

## 4.1) No Robot Available (Simulator Mode)

Use this for lesson practice without hardware.

1. Set mode to `Simulator`.
2. Click `Connect`.
3. Click `Enable Driving`.
4. Build and run Blockly programs.
5. Watch movement on the simulator stage grid.
6. Click `Disable Driving` at the end.
8. Click `Disable Driving` before ending session.

## 5) Fast Classroom Routine

Use this every class:

1. Connect USB and power robot.
2. Start `npm run dev`.
3. Open controller page.
4. Connect Bluetooth.
5. Enable driving.
6. Run Blockly program.
7. Emergency Stop if needed.
8. Disable driving and disconnect.

## 6) Troubleshooting (Plain English)

### Robot appears connected but does not move
- Click `Enable Driving` first.
- Increase the **speed** field on move blocks above 60, or raise **set default speed** earlier in the program.
- Check status log for safety block messages.

### Bluetooth connect button fails
- Refresh page and try again.
- Make sure Chrome or Edge is used.
- Turn Bluetooth off/on on Mac, retry.

### Robot moves once then stops
- This is usually watchdog safety behavior.
- Send another drive command (hold/press movement again).

### Direction is wrong (left/right reversed)
- Update invert settings in `firmware/include/config.h`:
  - `MOTOR_INVERT_LEFT`
  - `MOTOR_INVERT_RIGHT`
- Re-upload firmware.

## 7) Safety Notes for Students

- Keep wheels off the ground during first test.
- Use low speed for demos.
- Keep fingers and loose objects away from wheels.
- Use `Emergency Stop` immediately if behavior looks wrong.

## 8) Where to Change Behavior

- Default speed, timeouts, ramping: `firmware/include/config.h`
- Web UI text/buttons: `web-controller/src/pages/StudioPage.tsx`, `web-controller/src/layouts/SiteLayout.tsx`, and `web-controller/src/components/`
