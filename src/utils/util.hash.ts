import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export class Hash {
  // Hash password using bcrypt
  static getHashPassword(password: string): string {
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(password, salt);
  }

  // Compare provided password with hashed password
  static isValidPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
