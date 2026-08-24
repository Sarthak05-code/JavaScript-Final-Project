import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../db";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check for empty fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // 2. Check if email already exists.
    const [exist] = await pool.query("Select id from users where email = ? ", [
      email,
    ]);

    if ((exist as any[]).length > 0) {
      return res.status(409).json({
        message: "Email already exists. ",
      });
    }

    // 3. Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //4. Insert User
    await pool.query(
      "Insert into users (name , email , password_hash) values (? , ? , ?)",
      [name, email, hashPassword],
    );

    res.status(201).json({
      message: "User Registered sucessfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error. ",
    });
  }
};
