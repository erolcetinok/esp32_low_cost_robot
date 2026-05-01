type Props = {
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

export function ConnectionPanel({ connected, onConnect, onDisconnect }: Props) {
  return (
    <section className="scratch-panel">
      <h2>Connection</h2>
      <p className="panel-subtitle">Status: {connected ? "Connected" : "Disconnected"}</p>
      <div className="block-stack">
        <button className="block-button block-connect" onClick={onConnect} disabled={connected}>
          Connect
        </button>
        <button className="block-button block-disconnect" onClick={onDisconnect} disabled={!connected}>
          Disconnect
        </button>
      </div>
    </section>
  );
}
