import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { signJwt } from "../utils/jwt";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/me", authenticate, async (req: any, res) => {
	res.json({ user: req.user });
});

const RegisterSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	name: z.string().optional(),
});

const LoginSchema = z.object({
	email: z.email(),
	password: z.string(),
});

router.post("/register", async (req, res) => {
	const parsed = RegisterSchema.safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	const { email, password, name } = parsed.data;
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return res.status(409).json({ error: "User exists" });

	const hash = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: { email, password: hash, name },
	});
	const token = signJwt({ id: user.id, email: user.email, role: user.role });
	res.status(201).json({
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		},
		token,
	});
});

router.post("/login", async (req, res) => {
	const parsed = LoginSchema.safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	const { email, password } = parsed.data;
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return res.status(401).json({ error: "Invalid credentials" });

	const ok = await bcrypt.compare(password, user.password);
	if (!ok) return res.status(401).json({ error: "Invalid credentials" });

	const token = signJwt({ id: user.id, email: user.email, role: user.role });
	res.json({
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		},
		token,
	});
});

export default router;
