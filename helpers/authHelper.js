// bcrypt: A library used to hash passwords and compare them for authentication. It adds salt to 
// the hashing process,making it more secure against dictionary and brute-force attacks.

import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of rounds to generate salt (higher is more secure, but slower).
    const hashedPassword = await bcrypt.hash(password, saltRounds);  // Hash the password with the salt.
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

// This function compares a plain-text password with a hashed password to verify if they match.
// when user is again trying to log in the system

// internally hashes the plain-text password using the same salt and checks if it matches the hashed password.
// return true if password matches else false
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};