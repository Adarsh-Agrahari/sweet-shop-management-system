import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// ✅ Zod schema for validation
const SweetSchema = z.object({
	name: z.string(),
	category: z.string(),
	price: z.number().positive(),
	quantity: z.number().int().nonnegative(),
});

// ✅ Create Sweet (Admin only)
router.post("/", authenticate, requireAdmin, async (req, res) => {
	const parsed = SweetSchema.safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	const sweet = await prisma.sweet.create({ data: parsed.data });
	res.status(201).json(sweet);
});

// ✅ Get all sweets
router.get("/", authenticate, async (_req, res) => {
	const sweets = await prisma.sweet.findMany();
	res.json(sweets);
});

// ✅ Search sweets by name or category
router.get("/search", authenticate, async (req, res) => {
	const q = req.query.q as string;
	if (!q) return res.status(400).json({ error: "Query param 'q' required" });

	const sweets = await prisma.sweet.findMany({
		where: {
			OR: [
				{ name: { contains: q, mode: "insensitive" } },
				{ category: { contains: q, mode: "insensitive" } },
			],
		},
	});

	res.json(sweets);
});

// ✅ Update Sweet (Admin only)
router.put("/:id", authenticate, requireAdmin, async (req, res) => {
	const id = parseInt(req.params.id);
	const parsed = SweetSchema.partial().safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	try {
		const sweet = await prisma.sweet.update({
			where: { id },
			data: parsed.data,
		});
		res.json(sweet);
	} catch {
		res.status(404).json({ error: "Sweet not found" });
	}
});

// ✅ Delete Sweet (Admin only)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
	const id = parseInt(req.params.id);
	try {
		await prisma.sweet.delete({ where: { id } });
		res.json({ message: "Sweet deleted" });
	} catch {
		res.status(404).json({ error: "Sweet not found" });
	}
});

// ✅ Purchase Sweet (User) – decreases stock
router.post("/:id/purchase", authenticate, async (req: any, res) => {
	const id = parseInt(req.params.id);
	const qty = Number(req.body.quantity);

	if (!qty || qty <= 0)
		return res.status(400).json({ error: "Quantity must be > 0" });

	const sweet = await prisma.sweet.findUnique({ where: { id } });
	if (!sweet) return res.status(404).json({ error: "Sweet not found" });

	if (sweet.quantity < qty)
		return res.status(400).json({ error: "Not enough stock" });

	const updated = await prisma.sweet.update({
		where: { id },
		data: { quantity: { decrement: qty } },
	});

	res.json({
		message: `Purchased ${qty} ${sweet.name}(s)`,
		remaining: updated.quantity,
	});
});

// ✅ Restock Sweet (Admin only)
router.post("/:id/restock", authenticate, requireAdmin, async (req, res) => {
	const id = parseInt(req.params.id);
	const qty = Number(req.body.quantity);

	if (!qty || qty <= 0)
		return res.status(400).json({ error: "Quantity must be > 0" });

	try {
		const updated = await prisma.sweet.update({
			where: { id },
			data: { quantity: { increment: qty } },
		});
		res.json({ message: "Sweet restocked", sweet: updated });
	} catch {
		res.status(404).json({ error: "Sweet not found" });
	}
});

export default router;
