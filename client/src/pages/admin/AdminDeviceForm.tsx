import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import { categoryService } from '../../services/categoryService';
import { Device, Category, PinConfiguration, Specification, ExampleProject } from '../../types';
import {
  Save,
  ChevronLeft,
  Plus,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  BookOpen,
  GitBranch,
  Layers,
  Radio,
  FileCode,
} from 'lucide-react';

export const AdminDeviceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'basic' | 'technical' | 'principle' | 'pinout' | 'apps' | 'protocols' | 'projects'>('basic');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Device>>({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    category: '',
    subcategory: '',
    symbol: '',
    difficultyLevel: 'Beginner',
    manufacturer: 'Generic / Various',
    voltage: '3.3V – 5V DC',
    current: 'Operating current varies with load',
    powerRequirements: '',
    operatingRange: '-40°C to +85°C',
    workingPrinciple: '',
    workingPrincipleFlow: ['Signal excitation', 'Analog detection', 'Internal processing', 'Microcontroller readout'],
    howToUse: ['Connect VCC and GND', 'Interface communication bus', 'Read telemetry'],
    applications: ['Home Automation', 'Robotics'],
    advantages: ['Low cost', 'Easy interfacing'],
    limitations: ['Requires software timing'],
    communicationProtocols: ['I2C'],
    interfaces: ['Digital GPIO'],
    datasheetUrl: '',
    published: true,
    specifications: [
      { key: 'Operating Voltage', value: '3.3V to 5.0V', notes: 'Typical' },
      { key: 'Current Consumption', value: '15 mA', notes: 'Active' },
    ],
    pinConfiguration: [
      { pinNumber: '1', pinName: 'VCC', type: 'Power', description: 'Power supply input' },
      { pinNumber: '2', pinName: 'GND', type: 'Ground', description: '0V System Ground' },
      { pinNumber: '3', pinName: 'DATA', type: 'Digital I/O', description: 'Digital signal pin' },
    ],
    connectionDiagram: {
      description: 'Connect VCC to 5V, GND to GND, and signal to digital pin.',
      wiringSteps: ['VCC -> MCU 5V', 'GND -> MCU GND', 'Signal -> Digital Pin 2'],
    },
    exampleProjects: [
      {
        title: 'Basic Hardware Telemetry Reader',
        description: 'Read sensor state and print live metrics to serial monitor.',
        difficulty: 'Beginner',
        componentsNeeded: ['Sensor Module', 'Arduino Uno', 'Jumper Wires'],
        codeSnippet: 'void setup() { Serial.begin(9600); }\nvoid loop() { delay(1000); }',
      },
    ],
  });

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);

        if (isEditMode) {
          // If editing, find device by slug or id
          const allDevs = await deviceService.getDevices({ limit: 100, includeUnpublished: true });
          const found = allDevs.devices.find((d) => d._id === id);
          if (found) {
            setFormData({
              ...found,
              category: typeof found.category === 'object' ? (found.category as any)._id : found.category,
            });
          }
        } else if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        console.error('Failed to initialize form:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.shortDescription || !formData.detailedDescription || !formData.category || !formData.workingPrinciple) {
      setError('Please fill in all mandatory fields (Name, Short & Detailed Description, Category, Working Principle).');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode) {
        await deviceService.updateDevice(id!, formData);
        setSuccessMsg('Device updated successfully!');
      } else {
        await deviceService.createDevice(formData);
        setSuccessMsg('Device created successfully!');
        setTimeout(() => navigate('/admin/devices'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic Array Helpers
  const addPin = () => {
    setFormData((prev) => ({
      ...prev,
      pinConfiguration: [
        ...(prev.pinConfiguration || []),
        { pinNumber: `${(prev.pinConfiguration?.length || 0) + 1}`, pinName: 'PIN', type: 'Digital I/O', description: '' },
      ],
    }));
  };

  const removePin = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pinConfiguration: prev.pinConfiguration?.filter((_, i) => i !== index),
    }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: '', value: '', notes: '' }],
    }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications?.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      exampleProjects: [
        ...(prev.exampleProjects || []),
        {
          title: 'New IoT Project Idea',
          description: '',
          difficulty: 'Beginner',
          componentsNeeded: ['Board', 'Sensor'],
          codeSnippet: '',
        },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exampleProjects: prev.exampleProjects?.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/admin/devices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Manage Devices</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit IoT Device' : 'Add New IoT Device'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organized multi-section hardware specification editor with pinout, diagram, and firmware fields.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Saving...' : isEditMode ? 'Update Device' : 'Publish Device'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Navigation Tabs (Section 18 requirement: organized into tabs/sections) */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'basic' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>1. Basic Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('technical')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'technical' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>2. Specs & Power</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('principle')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'principle' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>3. Working & Usage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pinout')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'pinout' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>4. Pinout & Wiring</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('apps')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'apps' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>5. Apps & Pros/Cons</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'protocols' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>6. Protocols</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'projects' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>7. Projects & Code</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        {/* TAB 1: BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              1. Basic Hardware Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Device Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. DHT22 Digital Temperature & Humidity Sensor"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={typeof formData.category === 'object' ? (formData.category as any)?._id : formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={formData.subcategory || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g. Environmental Sensors"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficultyLevel || 'Beginner'}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manufacturer / Origin
                </label>
                <input
                  type="text"
                  value={formData.manufacturer || ''}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g. Bosch Sensortec, Espressif Systems"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Symbol Identifier (e.g. TH-DHT11, MCU-ESP32-DEVKIT)
                </label>
                <input
                  type="text"
                  value={formData.symbol || ''}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="TH-DHT22"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Description (1-2 sentences for cards) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary of what this device does..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Description ("What is it?") *
              </label>
              <textarea
                rows={4}
                required
                value={formData.detailedDescription || ''}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                placeholder="Comprehensive technical overview and hardware architecture..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="publishedCheck"
                checked={formData.published !== false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="publishedCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Publish device immediately (visible to all users in public catalog)
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL & SPECS */}
        {activeTab === 'technical' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              2. Technical & Electrical Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operating Voltage
                </label>
                <input
                  type="text"
                  value={formData.voltage || ''}
                  onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                  placeholder="3.3V – 5.5V DC"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operating Current
                </label>
                <input
                  type="text"
                  value={formData.current || ''}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  placeholder="15 mA active, 100 µA standby"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operating Range
                </label>
                <input
                  type="text"
                  value={formData.operatingRange || ''}
                  onChange={(e) => setFormData({ ...formData, operatingRange: e.target.value })}
                  placeholder="-40°C to +85°C, 0-100% RH"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Datasheet URL
                </label>
                <input
                  type="url"
                  value={formData.datasheetUrl || ''}
                  onChange={(e) => setFormData({ ...formData, datasheetUrl: e.target.value })}
                  placeholder="https://manufacturer.com/datasheet.pdf"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Specifications dynamic rows */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Dynamic Specifications Table
                </span>
                <button
                  type="button"
                  onClick={addSpec}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.specifications?.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => {
                        const copy = [...(formData.specifications || [])];
                        copy[idx].key = e.target.value;
                        setFormData({ ...formData, specifications: copy });
                      }}
                      placeholder="Parameter name"
                      className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => {
                        const copy = [...(formData.specifications || [])];
                        copy[idx].value = e.target.value;
                        setFormData({ ...formData, specifications: copy });
                      }}
                      placeholder="Value / Rating"
                      className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                    <input
                      type="text"
                      value={spec.notes || ''}
                      onChange={(e) => {
                        const copy = [...(formData.specifications || [])];
                        copy[idx].notes = e.target.value;
                        setFormData({ ...formData, specifications: copy });
                      }}
                      placeholder="Notes (e.g. version dependent)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORKING PRINCIPLE & USAGE */}
        {activeTab === 'principle' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              3. Working Principle & Step-by-Step Usage
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Working Principle Narrative *
              </label>
              <textarea
                rows={4}
                required
                value={formData.workingPrinciple || ''}
                onChange={(e) => setFormData({ ...formData, workingPrinciple: e.target.value })}
                placeholder="Explain the underlying physics/transducer principle in simple terms..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Visual Signal Flow Steps (One step per line)
              </label>
              <textarea
                rows={4}
                value={formData.workingPrincipleFlow?.join('\n') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingPrincipleFlow: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                  })
                }
                placeholder="Physical stimulus\nTransducer excitation\nADC conversion\nSerialized packet transmission"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                How to Use Instructions (One step per line)
              </label>
              <textarea
                rows={4}
                value={formData.howToUse?.join('\n') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    howToUse: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                  })
                }
                placeholder="Step 1: Supply 5V power\nStep 2: Connect I2C lines with pull-up\nStep 3: Read sensor registers"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* TAB 4: PINOUT & WIRING */}
        {activeTab === 'pinout' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              4. Pin Configuration & Wiring Instructions
            </h3>

            {/* Pin rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Pin Definitions
                </span>
                <button
                  type="button"
                  onClick={addPin}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pin</span>
                </button>
              </div>

              {formData.pinConfiguration?.map((pin, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pin.pinNumber}
                    onChange={(e) => {
                      const copy = [...(formData.pinConfiguration || [])];
                      copy[idx].pinNumber = e.target.value;
                      setFormData({ ...formData, pinConfiguration: copy });
                    }}
                    placeholder="Pin #"
                    className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-center"
                  />
                  <input
                    type="text"
                    value={pin.pinName}
                    onChange={(e) => {
                      const copy = [...(formData.pinConfiguration || [])];
                      copy[idx].pinName = e.target.value;
                      setFormData({ ...formData, pinConfiguration: copy });
                    }}
                    placeholder="Pin Identifier"
                    className="w-28 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                  <input
                    type="text"
                    value={pin.type}
                    onChange={(e) => {
                      const copy = [...(formData.pinConfiguration || [])];
                      copy[idx].type = e.target.value;
                      setFormData({ ...formData, pinConfiguration: copy });
                    }}
                    placeholder="Type (Power, I2C, etc.)"
                    className="w-36 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    value={pin.description}
                    onChange={(e) => {
                      const copy = [...(formData.pinConfiguration || [])];
                      copy[idx].description = e.target.value;
                      setFormData({ ...formData, pinConfiguration: copy });
                    }}
                    placeholder="Pin function description..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => removePin(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Connection Diagram description */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Connection Schematic Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.connectionDiagram?.description || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      connectionDiagram: {
                        ...(formData.connectionDiagram || { wiringSteps: [] }),
                        description: e.target.value,
                      },
                    })
                  }
                  placeholder="Wiring overview notes..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Breadboard Wiring Steps (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.connectionDiagram?.wiringSteps?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      connectionDiagram: {
                        ...(formData.connectionDiagram || { description: '' }),
                        wiringSteps: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                      },
                    })
                  }
                  placeholder="VCC -> MCU 5V\nGND -> MCU GND\nSDA -> Pin A4\nSCL -> Pin A5"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: APPLICATIONS, ADVANTAGES & LIMITATIONS */}
        {activeTab === 'apps' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              5. Real-World Applications & Pros/Cons
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Real-World Applications (One per line)
              </label>
              <textarea
                rows={3}
                value={formData.applications?.join('\n') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applications: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                  })
                }
                placeholder="Smart Agriculture automated irrigation\nWeather telemetry monitoring\nIndustrial SCADA alarms"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Advantages (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.advantages?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      advantages: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                    })
                  }
                  placeholder="Low cost\nAccurate calibration\nUltra low sleep current"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-700 dark:text-rose-400 mb-1">
                  Limitations (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.limitations?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limitations: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                    })
                  }
                  placeholder="Slow sampling rate\nLimited to non-subzero temperatures\nRequires external pull-up"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROTOCOLS */}
        {activeTab === 'protocols' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              6. Communication Protocols & Hardware Interfaces
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Communication Protocols (comma separated)
              </label>
              <input
                type="text"
                value={formData.communicationProtocols?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    communicationProtocols: e.target.value
                      .split(',')
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0),
                  })
                }
                placeholder="I2C, SPI, UART, Wi-Fi, LoRa, 1-Wire"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hardware Interfaces (comma separated)
              </label>
              <input
                type="text"
                value={formData.interfaces?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interfaces: e.target.value
                      .split(',')
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0),
                  })
                }
                placeholder="Digital GPIO, 10-bit ADC, PWM, Micro-USB"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(',')
                      .map((p) => p.trim())
                      .filter((p) => p.length > 0),
                  })
                }
                placeholder="Temperature, Humidity, Weather, Analog, I2C"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* TAB 7: EXAMPLE PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                7. Example Educational Projects
              </h3>
              <button
                type="button"
                onClick={addProject}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Example Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {formData.exampleProjects?.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="absolute top-4 right-4 p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded"
                    title="Remove Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const copy = [...(formData.exampleProjects || [])];
                          copy[idx].title = e.target.value;
                          setFormData({ ...formData, exampleProjects: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Difficulty</label>
                      <select
                        value={proj.difficulty}
                        onChange={(e) => {
                          const copy = [...(formData.exampleProjects || [])];
                          copy[idx].difficulty = e.target.value as any;
                          setFormData({ ...formData, exampleProjects: copy });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Project Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const copy = [...(formData.exampleProjects || [])];
                        copy[idx].description = e.target.value;
                        setFormData({ ...formData, exampleProjects: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Components Needed (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.componentsNeeded?.join(', ') || ''}
                      onChange={(e) => {
                        const copy = [...(formData.exampleProjects || [])];
                        copy[idx].componentsNeeded = e.target.value
                          .split(',')
                          .map((c) => c.trim())
                          .filter((c) => c.length > 0);
                        setFormData({ ...formData, exampleProjects: copy });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Firmware Code Snippet</label>
                    <textarea
                      rows={4}
                      value={proj.codeSnippet || ''}
                      onChange={(e) => {
                        const copy = [...(formData.exampleProjects || [])];
                        copy[idx].codeSnippet = e.target.value;
                        setFormData({ ...formData, exampleProjects: copy });
                      }}
                      className="w-full p-3 text-xs font-mono rounded-lg border border-slate-700 bg-slate-950 text-cyan-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Action */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/admin/devices"
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Saving...' : isEditMode ? 'Update Device' : 'Publish Device'}</span>
        </button>
      </div>
    </div>
  );
};
