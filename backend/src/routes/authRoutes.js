import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config.js';
import { authenticateUser, registerUser } from '../repositories/userRepository.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const signupSchema = z.object({ name: z.string().trim().min(1), email: z.string().email(), password: z.string().min(8) });
const firebaseSchema = z.object({ idToken: z.string().min(1) });
const issue = user => ({ token: jwt.sign(user, config.jwtSecret, { expiresIn: '8h' }), user });

export const authRoutes = Router();

authRoutes.post('/signup', async (req, res) => {
	const parsed = signupSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: 'Provide a name, valid email, and password with at least 8 characters.' });
	try {
		const user = await registerUser(parsed.data);
		if (!user) return res.status(409).json({ message: 'An account with this email already exists.' });
		return res.status(201).json(issue(user));
	} catch {
		return res.status(500).json({ message: 'Could not create the account.' });
	}
});

authRoutes.post('/login', async (req, res) => {
	const parsed = loginSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: 'Provide a valid email and password.' });
	try {
		let user = await authenticateUser(parsed.data.email, parsed.data.password);
		if (!user && config.mock && parsed.data.email.toLowerCase() === 'analyst@reqsphere.local' && parsed.data.password === 'password') {
			user = { id: 'local-user', email: parsed.data.email, name: 'Analyst', provider: 'password' };
		}
		if (!user) return res.status(401).json({ message: 'Email or password is incorrect.' });
		return res.json(issue(user));
	} catch {
		return res.status(500).json({ message: 'Could not sign in.' });
	}
});

authRoutes.post('/firebase', async (req, res) => {
	const parsed = firebaseSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ message: 'A Firebase ID token is required.' });
	if (config.mock) return res.json(issue({ id: 'google-user', email: 'google.user@example.com', name: 'Google User', provider: 'google' }));
	try {
		const { getAuth } = await import('firebase-admin/auth');
		const decoded = await getAuth().verifyIdToken(parsed.data.idToken);
		return res.json(issue({ id: decoded.uid, email: decoded.email, name: decoded.name ?? decoded.email, provider: 'google' }));
	} catch {
		return res.status(401).json({ message: 'Firebase token verification failed.' });
	}
});
