export class MockClient {
  private connected = false;
  private timer: number | null = null;
  private onStatus: ((message: string) => void) | null = null;

  async connect(onStatus: (message: string) => void): Promise<void> {
    this.connected = true;
    this.onStatus = onStatus;
    this.onStatus("[SIM] CONNECTED");
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.onStatus?.("[SIM] DISCONNECTED");
  }

  isConnected(): boolean {
    return this.connected;
  }

  async send(command: string): Promise<void> {
    if (!this.connected) throw new Error("Simulator is not connected");
    this.onStatus?.(`[SIM] ACK ${command}`);
    if (command === "PING") {
      this.timer = window.setTimeout(() => this.onStatus?.("[SIM] PONG"), 120);
    }
  }
}
