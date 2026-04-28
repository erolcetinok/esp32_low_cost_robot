# Bring-up

## Firmware Bring-up
1. Flash firmware from `firmware/`.
2. Open serial monitor at `115200`.
3. Confirm startup logs and help output.
4. Send `SAFE_OFF` to arm motors.
5. Run command tests (`F/B/L/R/S`) at low speed first.
6. Confirm watchdog auto-stop by pausing commands.

## BLE Bring-up
1. Start BLE advertising (automatic at boot).
2. Open the web controller and click Connect.
3. Send `PING` and verify status response.
4. Send `SAFE_OFF`, then directional commands.
5. Disconnect and verify robot stops.

## Troubleshooting
- Serial disconnects: keep using safe mode and low speed; verify command-only control path.
- BLE connects but no motion: send `SAFE_OFF` first, then movement command.
- One wheel reversed: change invert flags in `firmware/include/config.h`.
