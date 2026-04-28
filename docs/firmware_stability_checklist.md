# Firmware Stability Checklist

This checklist assumes hardware is fixed and focuses on software behavior.

## Preconditions
- Firmware built and flashed successfully.
- Serial monitor at `115200`.
- Robot starts in safe mode (`STBY` held low).

## Validation Steps
1. Confirm boot logs print reset reason and command help.
2. Send `PING`; verify `PONG`.
3. Send `SAFE_OFF`; verify acknowledgement and motor arm.
4. Send motion commands one at a time:
   - `F:80`
   - `S`
   - `B:80`
   - `S`
   - `L:80`
   - `S`
   - `R:80`
   - `S`
5. Stop sending commands and verify watchdog timeout triggers stop.
6. Send `SAFE_ON`; verify movement commands are blocked.

## Expected Safety Behavior
- Movement commands are blocked in safe mode.
- Watchdog forces `STOP` after command timeout.
- Acceleration ramps avoid abrupt duty-cycle jumps.
