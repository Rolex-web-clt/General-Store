/**
 * Authentication Controller
 * Handles customer & admin registration, login, logout, profile updates, and password changes.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../config/db';
import { signToken, AuthRequest } from '../middleware/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'CUSTOMER',
      phone: phone || '',
      addresses: [],
      isActive: true,
    });

    const token = signToken(newUser);
    res.cookie('token', token, COOKIE_OPTIONS);

    const { password: _, ...sanitizedUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Cornerstone General Store.',
      token,
      user: sanitizedUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact store support.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    const { password: _, ...sanitizedUser } = user;

    res.status(200).json({
      success: true,
      message: 'Signed in successfully!',
      token,
      user: sanitizedUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed.' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  });
};

export const getMe = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }
  const { password: _, ...sanitizedUser } = req.user;
  res.status(200).json({
    success: true,
    user: sanitizedUser,
  });
};

export const updateProfile = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, addresses } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (addresses !== undefined) updateData.addresses = addresses;

    const updatedUser = UserModel.findByIdAndUpdate(req.user.id, updateData);
    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { password: _, ...sanitized } = updatedUser;
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitized,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update profile.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    UserModel.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to change password.' });
  }
};
