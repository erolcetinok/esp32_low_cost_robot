export type RobotCommand = "F" | "B" | "L" | "R" | "S" | "SAFE_ON" | "SAFE_OFF" | "PING";

export function formatCommand(command: RobotCommand, speed?: number): string {
  if (command === "S" || command === "SAFE_ON" || command === "SAFE_OFF" || command === "PING") {
    return command;
  }
  const safeSpeed = Math.max(0, Math.min(255, speed ?? 80));
  return `${command}:${safeSpeed}`;
}
