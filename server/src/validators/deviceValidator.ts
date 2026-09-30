import { z } from 'zod';

const pinConfigSchema = z.object({
  pinNumber: z.string(),
  pinName: z.string(),
  type: z.string(),
  description: z.string(),
});

const specificationSchema = z.object({
  key: z.string(),
  value: z.string(),
  notes: z.string().optional(),
});

const exampleProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  componentsNeeded: z.array(z.string()).default([]),
  codeSnippet: z.string().optional(),
});

const connectionDiagramSchema = z.object({
  description: z.string().default(''),
  diagramSvg: z.string().optional(),
  wiringSteps: z.array(z.string()).default([]),
});

export const createDeviceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Device name is required'),
    shortDescription: z.string().min(10, 'Short description is required'),
    detailedDescription: z.string().min(20, 'Detailed description is required'),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().optional(),
    symbol: z.string().optional(),
    images: z.array(z.string()).optional(),
    workingPrinciple: z.string().min(10, 'Working principle is required'),
    workingPrincipleFlow: z.array(z.string()).optional(),
    howToUse: z.array(z.string()).optional(),
    applications: z.array(z.string()).min(1, 'At least one application is required'),
    specifications: z.array(specificationSchema).default([]),
    features: z.array(z.string()).default([]),
    advantages: z.array(z.string()).default([]),
    limitations: z.array(z.string()).default([]),
    communicationProtocols: z.array(z.string()).default([]),
    interfaces: z.array(z.string()).default([]),
    inputTypes: z.array(z.string()).default([]),
    outputTypes: z.array(z.string()).default([]),
    voltage: z.string().optional(),
    current: z.string().optional(),
    powerRequirements: z.string().optional(),
    operatingRange: z.string().optional(),
    pinConfiguration: z.array(pinConfigSchema).default([]),
    connectionDiagram: connectionDiagramSchema.optional(),
    exampleProjects: z.array(exampleProjectSchema).default([]),
    relatedDevices: z.array(z.string()).optional(),
    datasheetUrl: z.string().optional(),
    manufacturer: z.string().optional(),
    tags: z.array(z.string()).default([]),
    difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
    published: z.boolean().default(true),
  }),
});

export const updateDeviceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Device ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    shortDescription: z.string().min(10).optional(),
    detailedDescription: z.string().min(20).optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    symbol: z.string().optional(),
    images: z.array(z.string()).optional(),
    workingPrinciple: z.string().optional(),
    workingPrincipleFlow: z.array(z.string()).optional(),
    howToUse: z.array(z.string()).optional(),
    applications: z.array(z.string()).optional(),
    specifications: z.array(specificationSchema).optional(),
    features: z.array(z.string()).optional(),
    advantages: z.array(z.string()).optional(),
    limitations: z.array(z.string()).optional(),
    communicationProtocols: z.array(z.string()).optional(),
    interfaces: z.array(z.string()).optional(),
    inputTypes: z.array(z.string()).optional(),
    outputTypes: z.array(z.string()).optional(),
    voltage: z.string().optional(),
    current: z.string().optional(),
    powerRequirements: z.string().optional(),
    operatingRange: z.string().optional(),
    pinConfiguration: z.array(pinConfigSchema).optional(),
    connectionDiagram: connectionDiagramSchema.optional(),
    exampleProjects: z.array(exampleProjectSchema).optional(),
    relatedDevices: z.array(z.string()).optional(),
    datasheetUrl: z.string().optional(),
    manufacturer: z.string().optional(),
    tags: z.array(z.string()).optional(),
    difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    published: z.boolean().optional(),
  }),
});
