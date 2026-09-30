export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export const initialCategories: CategorySeed[] = [
  {
    name: 'Sensors',
    slug: 'sensors',
    description: 'Hardware transducers that detect environmental physical conditions such as temperature, humidity, pressure, motion, light, and gases, converting them into readable electrical signals.',
    icon: 'Radio',
    order: 1,
  },
  {
    name: 'Actuators',
    slug: 'actuators',
    description: 'Electromechanical and solid-state devices that convert electrical control signals into physical motion, force, audio signals, or switching actions in the physical environment.',
    icon: 'Zap',
    order: 2,
  },
  {
    name: 'Microcontrollers',
    slug: 'microcontrollers',
    description: 'Compact integrated circuits containing a processor core, memory, and programmable input/output peripherals designed to govern specific operations in embedded systems.',
    icon: 'Cpu',
    order: 3,
  },
  {
    name: 'Development Boards',
    slug: 'development-boards',
    description: 'Prototyping platforms that combine microcontrollers or processors with power regulation, USB programming interfaces, pin breakouts, and onboard peripherals.',
    icon: 'CircuitBoard',
    order: 4,
  },
  {
    name: 'Communication Modules',
    slug: 'communication-modules',
    description: 'Wireless and wired transceivers providing cellular, Bluetooth, Wi-Fi, LoRa, satellite, and RF connectivity for IoT endpoint telematics.',
    icon: 'Wifi',
    order: 5,
  },
  {
    name: 'Connectivity Technologies',
    slug: 'connectivity-technologies',
    description: 'Underlying physical layer protocols and communication stacks enabling short-range, local-area, and wide-area machine-to-machine data exchanges.',
    icon: 'Network',
    order: 6,
  },
  {
    name: 'Smart Home Devices',
    slug: 'smart-home-devices',
    description: 'Connected consumer electronics, smart switches, environmental hubs, and smart lighting systems integrated with home automation protocols.',
    icon: 'Home',
    order: 7,
  },
  {
    name: 'Industrial IoT',
    slug: 'industrial-iot',
    description: 'Ruggedized sensors, SCADA-interfaced devices, programmable logic controllers (PLCs), and industrial bus monitors engineered for harsh factory environments.',
    icon: 'Factory',
    order: 8,
  },
  {
    name: 'Healthcare IoT',
    slug: 'healthcare-iot',
    description: 'Biomedical monitors, pulse oximeters, ECG sensors, and wearable medical devices designed for remote patient monitoring and physiological telemetry.',
    icon: 'Activity',
    order: 9,
  },
  {
    name: 'Agriculture IoT',
    slug: 'agriculture-iot',
    description: 'Precision farming hardware including capacitive soil probes, solar weather stations, automated irrigation valves, and crop health monitoring nodes.',
    icon: 'Sprout',
    order: 10,
  },
  {
    name: 'Automotive IoT',
    slug: 'automotive-iot',
    description: 'CAN bus monitors, OBD-II telemetry loggers, vehicle trackers, and autonomous sensor suites for connected vehicles and fleet analytics.',
    icon: 'Car',
    order: 11,
  },
  {
    name: 'Wearable IoT',
    slug: 'wearable-iot',
    description: 'Miniaturized, ultra-low-power fitness bands, smart garments, pedometers, and body area network sensors engineered for human interaction.',
    icon: 'Watch',
    order: 12,
  },
  {
    name: 'Tracking & Identification',
    slug: 'tracking-identification',
    description: 'RFID tags, NFC transponders, GNSS/GPS receivers, and active beacon hardware for asset tracking, inventory logistics, and access control.',
    icon: 'MapPin',
    order: 13,
  },
  {
    name: 'Power & Energy',
    slug: 'power-energy',
    description: 'Smart energy meters, current transformers (CT clamps), solar charge controllers, battery management systems (BMS), and energy harvesting modules.',
    icon: 'BatteryCharging',
    order: 14,
  },
  {
    name: 'IoT Gateways',
    slug: 'iot-gateways',
    description: 'Edge bridge devices that aggregate local sensor fieldbuses (Zigbee, Modbus, BLE, LoRaWAN) and translate protocols for secure cloud ingress over Ethernet or Cellular.',
    icon: 'Server',
    order: 15,
  },
  {
    name: 'Edge Computing Devices',
    slug: 'edge-computing-devices',
    description: 'High-throughput microprocessor boards with neural processing units (NPUs) or GPUs for running on-device computer vision, inference, and real-time audio analytics.',
    icon: 'HardDrive',
    order: 16,
  },
  {
    name: 'Security Devices',
    slug: 'security-devices',
    description: 'Cryptographic hardware security modules (HSMs), secure elements (ATECC608), tamper sensors, and physical intrusion detectors for securing IoT ecosystems.',
    icon: 'ShieldCheck',
    order: 17,
  },
  {
    name: 'Environmental Monitoring',
    slug: 'environmental-monitoring',
    description: 'Dedicated air quality, particulate matter (PM2.5/PM10), radiation, water turbidity, and weather telemetry stations for environmental science.',
    icon: 'CloudRain',
    order: 18,
  },
];
