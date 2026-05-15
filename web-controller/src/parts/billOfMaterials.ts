export type Part = {
  name: string;
  description: string;
  quantity: number;
  unitPriceUSD: number;
  notes?: string;
};

export type PartCategory = {
  name: string;
  blurb: string;
  parts: Part[];
};

export const BOM: PartCategory[] = [
  {
    name: "Electronics",
    blurb: "The brain and the parts that wire it up.",
    parts: [
      {
        name: "ESP32 DevKit",
        description: "Microcontroller board with Bluetooth and Wi-Fi built in.",
        quantity: 1,
        unitPriceUSD: 8.0,
        notes: "ESP32-WROOM-32 module on a DevKit V1 board.",
      },
      {
        name: "TB6612FNG motor driver",
        description: "Lets the ESP32 control two motors at the right voltage and current.",
        quantity: 1,
        unitPriceUSD: 3.0,
      },
      {
        name: "Jumper wires (assorted)",
        description: "Pre-crimped wires for connecting the boards. A pack of 40 is plenty.",
        quantity: 1,
        unitPriceUSD: 3.0,
        notes: "You'll only use about 10 wires per robot.",
      },
    ],
  },
  {
    name: "Drivetrain",
    blurb: "Motors and wheels — what actually makes the robot move.",
    parts: [
      {
        name: "TT gear motor with wheel",
        description: "The standard yellow hobby motor. Includes a wheel.",
        quantity: 2,
        unitPriceUSD: 2.5,
      },
    ],
  },
  {
    name: "Power",
    blurb: "What supplies energy to the robot.",
    parts: [
      {
        name: "9V battery",
        description: "Powers the motors and the ESP32. A rechargeable 9V works too.",
        quantity: 1,
        unitPriceUSD: 2.0,
      },
      {
        name: "9V battery clip with leads",
        description: "Connects the battery to the rest of the circuit.",
        quantity: 1,
        unitPriceUSD: 1.0,
      },
    ],
  },
  {
    name: "Chassis & misc",
    blurb: "The frame and the small parts that hold it together.",
    parts: [
      {
        name: "3D-printed chassis",
        description: "The body of the robot. STL files are open and in the repo.",
        quantity: 1,
        unitPriceUSD: 2.5,
        notes: "About $2.50 in filament at typical print settings. Free if your school's printer is available.",
      },
      {
        name: "M3 standoffs and screws",
        description: "Holds the motors and the ESP32 onto the chassis.",
        quantity: 1,
        unitPriceUSD: 2.0,
        notes: "A small assortment kit covers several robots.",
      },
    ],
  },
];

export const TOOLS: { name: string; notes: string }[] = [
  {
    name: "Micro-USB cable",
    notes: "For flashing firmware to the ESP32 the first time. Almost every household has one.",
  },
  {
    name: "Small Phillips screwdriver",
    notes: "For assembling the chassis.",
  },
  {
    name: "Wire strippers",
    notes: "Only needed if you're cutting fresh wires instead of using a jumper pack.",
  },
];

export function categorySubtotal(cat: PartCategory): number {
  return cat.parts.reduce((sum, p) => sum + p.quantity * p.unitPriceUSD, 0);
}

export function totalUSD(bom: PartCategory[] = BOM): number {
  return bom.reduce((sum, cat) => sum + categorySubtotal(cat), 0);
}

export function formatUSD(n: number): string {
  return `$${n.toFixed(2)}`;
}
