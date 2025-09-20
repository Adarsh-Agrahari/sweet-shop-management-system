import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { verifyJwt } from "../utils/jwt";

const router = Router();

// Middleware to protect routes
const authMiddleware = (req: any, res: any, next: any) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Unauthorized" });

	try {
		req.user = verifyJwt(token);
		next();
	} catch (err) {
		res.status(401).json({ error: "Invalid token" });
	}
};

// Middleware to allow Admin-only
const adminMiddleware = (req: any, res: any, next: any) => {
	if (req.user.role !== "admin")
		return res.status(403).json({ error: "Forbidden" });
	next();
};

// Zod schema for creating/updating sweet
const SweetSchema = z.object({
	name: z.string(),
	category: z.string(),
	price: z.number().positive(),
	quantity: z.number().int().nonnegative(),
});

// Create Sweet (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
	const parsed = SweetSchema.safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	const sweet = await prisma.sweet.create({ data: parsed.data });
	res.status(201).json(sweet);
});

// Get all sweets
router.get("/", authMiddleware, async (_req, res) => {
	const sweets = await prisma.sweet.findMany();
	res.json(sweets);
});

// Search sweets by name, category, or price range
router.get("/search", authMiddleware, async (req, res) => {
	const { name, category, minPrice, maxPrice } = req.query;

	const sweets = await prisma.sweet.findMany({
		where: {
			AND: [
				name
					? { name: { contains: String(name), mode: "insensitive" } }
					: {},
				category
					? {
							category: {
								contains: String(category),
								mode: "insensitive",
							},
					  }
					: {},
				minPrice ? { price: { gte: Number(minPrice) } } : {},
				maxPrice ? { price: { lte: Number(maxPrice) } } : {},
			],
		},
	});
	res.json(sweets);
});

// Update sweet (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
	const { id } = req.params;
	const parsed = SweetSchema.partial().safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	try {
		const sweet = await prisma.sweet.update({
			where: { id: Number(id) },
			data: parsed.data,
		});
		res.json(sweet);
	} catch {
		res.status(404).json({ error: "Sweet not found" });
	}
});

// Delete sweet (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.sweet.delete({ where: { id: Number(id) } });
		res.json({ message: "Deleted successfully" });
	} catch {
		res.status(404).json({ error: "Sweet not found" });
	}
});

// Purchase sweet (any authenticated user)
router.post("/:id/purchase", authMiddleware, async (req: any, res) => {
	const { id } = req.params;

	try {
		const sweet = await prisma.sweet.findUnique({
			where: { id: Number(id) },
		});
		if (!sweet) return res.status(404).json({ error: "Sweet not found" });
		if (sweet.quantity <= 0)
			return res.status(400).json({ error: "Out of stock" });

		const updated = await prisma.sweet.update({
			where: { id: Number(id) },
			data: { quantity: sweet.quantity - 1 },
		});

		res.json(updated);
	} catch {
		res.status(500).json({ error: "Something went wrong" });
	}
});

// Restock sweet (Admin only)
router.post(
	"/:id/restock",
	authMiddleware,
	adminMiddleware,
	async (req, res) => {
		const { id } = req.params;
		const { quantity } = req.body;
		if (!quantity || quantity <= 0)
			return res.status(400).json({ error: "Invalid quantity" });

		try {
			const sweet = await prisma.sweet.update({
				where: { id: Number(id) },
				data: { quantity: { increment: Number(quantity) } },
			});
			res.json(sweet);
		} catch {
			res.status(404).json({ error: "Sweet not found" });
		}
	}
);

export default router;
