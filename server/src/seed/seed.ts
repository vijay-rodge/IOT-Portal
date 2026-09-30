import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { Category } from '../models/Category.js';
import { Device } from '../models/Device.js';
import { User, UserRole, AuthProvider } from '../models/User.js';
import { initialCategories } from './categoriesData.js';
import { initialDevices } from './devicesData.js';
import { slugify } from '../utils/slugify.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('[Seed] Starting database seeding process...');

    // 1. Seed or Upsert Categories
    console.log(`[Seed] Processing ${initialCategories.length} categories...`);
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();

    for (const catData of initialCategories) {
      const category = await Category.findOneAndUpdate(
        { slug: catData.slug },
        {
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          icon: catData.icon,
          order: catData.order,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoryMap.set(catData.slug, category._id);
    }
    console.log(`[Seed] Successfully synchronized ${categoryMap.size} categories.`);

    // 2. Seed or Upsert Devices
    console.log(`[Seed] Processing ${initialDevices.length} devices...`);
    let createdOrUpdatedCount = 0;
    const deviceIds: mongoose.Types.ObjectId[] = [];

    for (const devData of initialDevices) {
      const categoryId = categoryMap.get(devData.categorySlug);
      if (!categoryId) {
        console.warn(`[Seed] Category slug '${devData.categorySlug}' not found for device '${devData.name}'. Skipping.`);
        continue;
      }

      const slug = slugify(devData.name);

      const device = await Device.findOneAndUpdate(
        { slug },
        {
          name: devData.name,
          slug,
          category: categoryId,
          subcategory: devData.subcategory,
          shortDescription: devData.shortDescription,
          detailedDescription: devData.detailedDescription,
          symbol: devData.symbol,
          workingPrinciple: devData.workingPrinciple,
          workingPrincipleFlow: devData.workingPrincipleFlow,
          howToUse: devData.howToUse,
          applications: devData.applications,
          specifications: devData.specifications,
          features: devData.features,
          advantages: devData.advantages,
          limitations: devData.limitations,
          communicationProtocols: devData.communicationProtocols,
          interfaces: devData.interfaces,
          inputTypes: devData.inputTypes,
          outputTypes: devData.outputTypes,
          voltage: devData.voltage,
          current: devData.current,
          powerRequirements: devData.powerRequirements,
          operatingRange: devData.operatingRange,
          pinConfiguration: devData.pinConfiguration,
          connectionDiagram: devData.connectionDiagram,
          exampleProjects: devData.exampleProjects,
          datasheetUrl: devData.datasheetUrl || '',
          manufacturer: devData.manufacturer || 'Generic / Various',
          tags: devData.tags,
          difficultyLevel: devData.difficultyLevel,
          published: devData.published,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      deviceIds.push(device._id);
      createdOrUpdatedCount++;
    }
    console.log(`[Seed] Successfully synchronized ${createdOrUpdatedCount} devices.`);

    // 3. Update Category Device Counts
    console.log('[Seed] Updating category device counts...');
    for (const [slug, catId] of categoryMap.entries()) {
      const count = await Device.countDocuments({ category: catId, published: true });
      await Category.findByIdAndUpdate(catId, { deviceCount: count });
    }

    // 4. Create Admin User if configured via environment variables
    if (ENV.ADMIN_EMAIL && ENV.ADMIN_PASSWORD) {
      const normalizedAdminEmail = ENV.ADMIN_EMAIL.toLowerCase().trim();
      const existingAdmin = await User.findOne({ email: normalizedAdminEmail });

      if (!existingAdmin) {
        console.log(`[Seed] Creating initial administrator user: ${normalizedAdminEmail}`);
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);

        await User.create({
          name: ENV.ADMIN_NAME || 'Portal Administrator',
          email: normalizedAdminEmail,
          passwordHash,
          role: UserRole.ADMIN,
          authProvider: AuthProvider.LOCAL,
          isVerified: true,
        });
        console.log('[Seed] Administrator account successfully created.');
      } else {
        // Ensure role is ADMIN
        if (existingAdmin.role !== UserRole.ADMIN) {
          existingAdmin.role = UserRole.ADMIN;
          await existingAdmin.save();
          console.log('[Seed] Updated existing user to ADMIN role.');
        } else {
          console.log('[Seed] Administrator account already exists.');
        }
      }
    } else {
      console.log('[Seed] No ADMIN_EMAIL/ADMIN_PASSWORD in environment. Skipping admin creation.');
    }

    console.log('[Seed] Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Database seeding error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1]?.includes('seed')) {
  seedDatabase();
}
