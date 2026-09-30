import bcrypt from 'bcryptjs';
import { User, UserRole, AuthProvider } from '../models/User.js';
import { Category } from '../models/Category.js';
import { initialCategories } from './categoriesData.js';

let autoSeeded = false;

export const autoSeedIfEmpty = async (): Promise<void> => {
  if (autoSeeded) return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Database has 0 users. Seeding default admin user...');
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('AdminPass123!', salt);

      await User.create({
        name: 'Portal Administrator',
        email: 'admin@iotportal.com',
        passwordHash,
        role: UserRole.ADMIN,
        authProvider: AuthProvider.LOCAL,
        isVerified: true,
      });
      console.log('[AutoSeed] Default admin created: admin@iotportal.com / AdminPass123!');
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log(`[AutoSeed] Seeding ${initialCategories.length} categories...`);
      for (const cat of initialCategories) {
        await Category.create(cat);
      }
      console.log('[AutoSeed] Initial categories seeded successfully.');
    }

    autoSeeded = true;
  } catch (err) {
    console.error('[AutoSeed] Notice:', err);
  }
};
