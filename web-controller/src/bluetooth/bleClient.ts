const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const CMD_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";
const STATUS_UUID = "19b10002-e8f2-537e-4f6c-d104768a1214";

export class BleClient {
  private device: BluetoothDevice | null = null;
  private cmdCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private statusCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

  async connect(onStatus: (message: string) => void): Promise<void> {
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }],
      optionalServices: [SERVICE_UUID],
    });
    const server = await this.device.gatt?.connect();
    if (!server) throw new Error("BLE GATT server unavailable");

    const service = await server.getPrimaryService(SERVICE_UUID);
    this.cmdCharacteristic = await service.getCharacteristic(CMD_UUID);
    this.statusCharacteristic = await service.getCharacteristic(STATUS_UUID);

    await this.statusCharacteristic.startNotifications();
    this.statusCharacteristic.addEventListener("characteristicvaluechanged", (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value ? new TextDecoder().decode(target.value.buffer) : "";
      onStatus(value);
    });
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.cmdCharacteristic = null;
    this.statusCharacteristic = null;
  }

  isConnected(): boolean {
    return !!this.device?.gatt?.connected;
  }

  async send(command: string): Promise<void> {
    if (!this.cmdCharacteristic) throw new Error("Not connected");
    await this.cmdCharacteristic.writeValue(new TextEncoder().encode(command));
  }
}
