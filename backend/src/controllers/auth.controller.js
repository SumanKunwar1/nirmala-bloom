import jwt from "jsonwebtoken";
import config from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { success, created } from "../utils/ApiResponse.js";
import User from "../models/User.js";

const signToken = (id) => jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
    maxAge: config.jwt.cookieExpiresDays * 24 * 60 * 60 * 1000,
  });
};

/** POST /auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw ApiError.badRequest("Email and password are required");

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Incorrect email or password");
  }
  if (!user.active) throw ApiError.forbidden("This account has been disabled");

  const token = signToken(user.id);
  setCookie(res, token);
  return success(res, { token, user: user.toJSON() }, "Signed in");
});

/** POST /auth/register — admin-only (create additional staff accounts). */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) throw ApiError.badRequest("Name, email and password are required");

  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) throw ApiError.conflict("A user with that email already exists");

  const user = await User.create({ name, email, password, role });
  return created(res, { user: user.toJSON() }, "User created");
});

/** GET /auth/me */
export const me = asyncHandler(async (req, res) => success(res, req.user));

/** POST /auth/logout */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return success(res, null, "Signed out");
});

/** PATCH /auth/password */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw ApiError.badRequest("Current and new password are required");

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.unauthorized("Your current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  return success(res, null, "Password updated");
});
