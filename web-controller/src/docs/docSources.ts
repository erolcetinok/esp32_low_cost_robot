import bringupMd from "../../../docs/bringup.md?raw";
import bluetoothProtocolMd from "../../../docs/bluetooth_protocol.md?raw";
import firmwareStabilityMd from "../../../docs/firmware_stability_checklist.md?raw";
import setupGuideMd from "../../../docs/setup_guide.md?raw";
import wiringMd from "../../../docs/wiring.md?raw";

export const DOCS_BY_SLUG = {
  setup: { title: "Setup Guide", markdown: setupGuideMd },
  bringup: { title: "Bring-up", markdown: bringupMd },
  wiring: { title: "Wiring", markdown: wiringMd },
  "bluetooth-protocol": { title: "Bluetooth Protocol", markdown: bluetoothProtocolMd },
  "firmware-checklist": { title: "Firmware Stability Checklist", markdown: firmwareStabilityMd },
} as const;

export type DocSlug = keyof typeof DOCS_BY_SLUG;

export function isDocSlug(s: string | undefined): s is DocSlug {
  return s !== undefined && s in DOCS_BY_SLUG;
}

export const DOC_HUB_SECTIONS: { label: string; slugs: DocSlug[] }[] = [
  { label: "Getting started", slugs: ["setup", "bringup"] },
  { label: "Hardware", slugs: ["wiring"] },
  { label: "Firmware", slugs: ["firmware-checklist"] },
  { label: "Bluetooth", slugs: ["bluetooth-protocol"] },
];
