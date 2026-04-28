type Props = {
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

export function ConnectionPanel({ connected, onConnect, onDisconnect }: Props) {
  return (
    <section className="panel">
      <h2>Connection</h2>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <div className="row">
        <button onClick={onConnect} disabled={connected}>
          Connect
        </button>
        <button onClick={onDisconnect} disabled={!connected}>
          Disconnect
        </button>
      </div>
    </section>
  );
}
