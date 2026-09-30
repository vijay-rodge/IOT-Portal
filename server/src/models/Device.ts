import mongoose, { Schema, Document, Types } from 'mongoose';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IPinConfiguration {
  pinNumber: string;
  pinName: string;
  type: string; // e.g. Power, Ground, Digital I/O, Analog In, PWM, UART, I2C
  description: string;
}

export interface ISpecification {
  key: string;
  value: string;
  notes?: string;
}

export interface IExampleProject {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  componentsNeeded: string[];
  codeSnippet?: string;
}

export interface IConnectionDiagram {
  description: string;
  diagramSvg?: string;
  wiringSteps: string[];
}

export interface IDevice extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  category: Types.ObjectId;
  subcategory?: string;
  symbol?: string; // Electronic symbol representation or SVG string
  images: string[];
  workingPrinciple: string;
  workingPrincipleFlow?: string[];
  howToUse: string[];
  applications: string[];
  specifications: ISpecification[];
  features: string[];
  advantages: string[];
  limitations: string[];
  communicationProtocols: string[];
  interfaces: string[];
  inputTypes: string[];
  outputTypes: string[];
  voltage: string;
  current: string;
  powerRequirements: string;
  operatingRange: string;
  pinConfiguration: IPinConfiguration[];
  connectionDiagram: IConnectionDiagram;
  exampleProjects: IExampleProject[];
  relatedDevices: Types.ObjectId[];
  datasheetUrl?: string;
  manufacturer?: string;
  tags: string[];
  difficultyLevel: DifficultyLevel;
  published: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      index: true,
    },
    symbol: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    workingPrinciple: {
      type: String,
      required: true,
    },
    workingPrincipleFlow: {
      type: [String],
      default: [],
    },
    howToUse: {
      type: [String],
      default: [],
    },
    applications: {
      type: [String],
      default: [],
      index: true,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        notes: { type: String },
      },
    ],
    features: {
      type: [String],
      default: [],
    },
    advantages: {
      type: [String],
      default: [],
    },
    limitations: {
      type: [String],
      default: [],
    },
    communicationProtocols: {
      type: [String],
      default: [],
      index: true,
    },
    interfaces: {
      type: [String],
      default: [],
      index: true,
    },
    inputTypes: {
      type: [String],
      default: [],
    },
    outputTypes: {
      type: [String],
      default: [],
    },
    voltage: {
      type: String,
      default: '3.3V - 5V typical (module-dependent)',
    },
    current: {
      type: String,
      default: 'Operating current varies with load',
    },
    powerRequirements: {
      type: String,
      default: '',
    },
    operatingRange: {
      type: String,
      default: '',
    },
    pinConfiguration: [
      {
        pinNumber: { type: String, required: true },
        pinName: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    connectionDiagram: {
      description: { type: String, default: '' },
      diagramSvg: { type: String, default: '' },
      wiringSteps: { type: [String], default: [] },
    },
    exampleProjects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Beginner',
        },
        componentsNeeded: { type: [String], default: [] },
        codeSnippet: { type: String },
      },
    ],
    relatedDevices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
    datasheetUrl: {
      type: String,
      default: '',
    },
    manufacturer: {
      type: String,
      default: 'Generic / Various',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    difficultyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for global search
deviceSchema.index(
  {
    name: 'text',
    shortDescription: 'text',
    detailedDescription: 'text',
    tags: 'text',
    applications: 'text',
    manufacturer: 'text',
  },
  {
    weights: {
      name: 10,
      tags: 5,
      applications: 4,
      shortDescription: 3,
      detailedDescription: 1,
      manufacturer: 2,
    },
    name: 'DeviceTextIndex',
  }
);

export const Device = mongoose.model<IDevice>('Device', deviceSchema);
