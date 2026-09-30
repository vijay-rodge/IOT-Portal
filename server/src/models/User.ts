import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google'
}

export interface IRecentlyViewed {
  device: Types.ObjectId;
  viewedAt: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  role: UserRole;
  isVerified: boolean;
  bookmarks: Types.ObjectId[];
  recentlyViewed: IRecentlyViewed[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.LOCAL,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
    recentlyViewed: [
      {
        device: {
          type: Schema.Types.ObjectId,
          ref: 'Device',
          required: true,
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Method to verify password using bcrypt
import bcrypt from 'bcryptjs';

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
