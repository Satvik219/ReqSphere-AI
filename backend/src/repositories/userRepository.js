import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const usersFile = resolve(dirname(fileURLToPath(import.meta.url)), '../../data/users.json');

async function readUsers() {
  try {
    return JSON.parse(await readFile(usersFile, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveUsers(users) {
  await mkdir(dirname(usersFile), { recursive: true });
  await writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

function publicUser({ id, name, email, provider }) {
  return { id, name, email, provider };
}

export async function registerUser({ name, email, password }) {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some(user => user.email === normalizedEmail)) return null;

  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12),
    provider: 'password',
  };
  users.push(user);
  await saveUsers(users);
  return publicUser(user);
}

export async function authenticateUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = (await readUsers()).find(candidate => candidate.email === normalizedEmail);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return publicUser(user);
}