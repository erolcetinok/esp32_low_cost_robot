# Bluetooth Protocol

BLE service and characteristics:
- Service UUID: `19b10000-e8f2-537e-4f6c-d104768a1214`
- Command characteristic (write): `19b10001-e8f2-537e-4f6c-d104768a1214`
- Status characteristic (notify/read): `19b10002-e8f2-537e-4f6c-d104768a1214`

## Commands
- `F:<speed>` forward
- `B:<speed>` backward
- `L:<speed>` left in place
- `R:<speed>` right in place
- `S` stop
- `SAFE_ON` force standby and block movement
- `SAFE_OFF` allow movement commands
- `PING` health check
- `HELP` command list

`<speed>` range is `0..255`.

## Responses (examples)
- `[BLE] OK FORWARD`
- `[BLE] SAFE_MODE_BLOCK`
- `[WATCHDOG] COMMAND TIMEOUT -> STOP`
- `[BLE] PONG`
