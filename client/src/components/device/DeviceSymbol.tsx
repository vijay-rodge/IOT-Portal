import React from 'react';
import {
  Thermometer,
  Activity,
  Cpu,
  Radio,
  Zap,
  Gauge,
  Eye,
  Flame,
  CloudRain,
  Compass,
  Wifi,
  Navigation,
  Key,
  Layers,
  Power,
  Server,
} from 'lucide-react';

interface DeviceSymbolProps {
  symbolCode?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DeviceSymbol: React.FC<DeviceSymbolProps> = ({
  symbolCode = '',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm p-1.5',
    md: 'w-14 h-14 text-base p-3',
    lg: 'w-20 h-20 text-xl p-4',
  };

  const iconSizes = {
    sm: 16,
    md: 26,
    lg: 38,
  };

  const iconSize = iconSizes[size];

  // Map symbol codes to visual icons & schematics
  const renderIcon = () => {
    switch (symbolCode.toUpperCase()) {
      case 'TH-DHT11':
      case 'TH-DHT22':
        return <Thermometer size={iconSize} className="text-cyan-500 dark:text-cyan-400" />;
      case 'TEMP-LM35':
        return <Thermometer size={iconSize} className="text-amber-500 dark:text-amber-400" />;
      case '1WIRE-DS18B20':
        return <Thermometer size={iconSize} className="text-blue-500 dark:text-blue-400" />;
      case 'SONAR-HCSR04':
        return <Radio size={iconSize} className="text-indigo-500 dark:text-indigo-400" />;
      case 'PIR-HCSR501':
        return <Activity size={iconSize} className="text-emerald-500 dark:text-emerald-400" />;
      case 'RES-LDR':
        return <Eye size={iconSize} className="text-amber-400 dark:text-amber-300" />;
      case 'GAS-MQ2':
        return <Flame size={iconSize} className="text-rose-500 dark:text-rose-400" />;
      case 'SOIL-CAP-12':
        return <CloudRain size={iconSize} className="text-emerald-500 dark:text-emerald-400" />;
      case 'PRESS-BMP280':
      case 'ENV-BME280':
        return <Gauge size={iconSize} className="text-sky-500 dark:text-sky-400" />;
      case 'OPTO-IR-PROX':
        return <Eye size={iconSize} className="text-red-500 dark:text-red-400" />;
      case 'IMU-MPU6050':
        return <Compass size={iconSize} className="text-purple-500 dark:text-purple-400" />;
      case 'ACT-SERVO-SG90':
      case 'ACT-STEPPER-28BYJ':
        return <Zap size={iconSize} className="text-amber-500 dark:text-amber-400" />;
      case 'RELAY-1CH-5V':
        return <Power size={iconSize} className="text-blue-500 dark:text-blue-400" />;
      case 'ACT-SOLENOID-12V':
        return <Zap size={iconSize} className="text-orange-500 dark:text-orange-400" />;
      case 'MCU-ARDUINO-UNO':
      case 'MCU-STM32-BLUEPILL':
      case 'MCU-RPI-PICO-RP2040':
        return <Cpu size={iconSize} className="text-teal-500 dark:text-teal-400" />;
      case 'MCU-NODEMCU-ESP8266':
      case 'MCU-ESP32-DEVKIT':
        return <Wifi size={iconSize} className="text-blue-500 dark:text-blue-400" />;
      case 'SBC-RPI4-B':
        return <Layers size={iconSize} className="text-rose-500 dark:text-rose-400" />;
      case 'COMM-BT-HC05':
        return <Radio size={iconSize} className="text-blue-600 dark:text-blue-400" />;
      case 'COMM-LORA-SX1278':
        return <Radio size={iconSize} className="text-violet-500 dark:text-violet-400" />;
      case 'ID-RFID-RC522':
      case 'COMM-NFC-PN532':
        return <Key size={iconSize} className="text-emerald-500 dark:text-emerald-400" />;
      case 'NAV-GPS-NEO6M':
        return <Navigation size={iconSize} className="text-sky-500 dark:text-sky-400" />;
      case 'COMM-GSM-SIM800L':
        return <Radio size={iconSize} className="text-red-500 dark:text-red-400" />;
      case 'COMM-RF-NRF24L01':
        return <Radio size={iconSize} className="text-cyan-500 dark:text-cyan-400" />;
      case 'GW-MODBUS-ETH':
        return <Server size={iconSize} className="text-amber-500 dark:text-amber-400" />;
      default:
        return <Cpu size={iconSize} className="text-brand-500 dark:text-brand-400" />;
    }
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shadow-inner ${sizeClasses[size]} ${className}`}
    >
      {renderIcon()}
    </div>
  );
};
