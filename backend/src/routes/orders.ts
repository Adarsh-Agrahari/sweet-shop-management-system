import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// ✅ Zod schema for placing an order
const OrderSchema = z.object({
	sweetId: z.number(),
	quantity: z.number().min(1),
});

// ✅ Place a new order
router.post("/", authenticate, async (req: any, res) => {
	const parsed = OrderSchema.safeParse(req.body);
	if (!parsed.success)
		return res.status(400).json({ error: parsed.error.issues });

	const { sweetId, quantity } = parsed.data;
	const userId = req.user.id;

	// Find the sweet
	const sweet = await prisma.sweet.findUnique({ where: { id: sweetId } });
	if (!sweet) return res.status(404).json({ error: "Sweet not found" });

	if (sweet.quantity < quantity)
		return res.status(400).json({ error: "Not enough stock" });

	// Transaction: create order and decrement stock atomically
	const [order] = await prisma.$transaction([
		prisma.order.create({
			data: {
				userId,
				sweetId,
				quantity,
				total: sweet.price * quantity,
			},
		}),
		prisma.sweet.update({
			where: { id: sweetId },
			data: { quantity: { decrement: quantity } },
		}),
	]);

	res.status(201).json({
		message: `Order placed for ${quantity} ${sweet.name}(s)`,
		order,
	});
});

// ✅ Get all orders
// Users see only their orders; Admin sees all orders
router.get("/", authenticate, async (req: any, res) => {
	const user = req.user;

	let orders;
	if (user.role === "ADMIN") {
		orders = await prisma.order.findMany({
			include: { sweet: true, user: true },
			orderBy: { createdAt: "desc" },
		});
	} else {
		orders = await prisma.order.findMany({
			where: { userId: user.id },
			include: { sweet: true },
			orderBy: { createdAt: "desc" },
		});
	}

	res.json(orders);
});

// ✅ Admin-only: Update order status (optional)
router.patch("/:id/status", authenticate, requireAdmin, async (req, res) => {
	const id = parseInt(req.params.id);
	const { status } = req.body;

	if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status))
		return res.status(400).json({ error: "Invalid status" });

	try {
		const updated = await prisma.order.update({
			where: { id },
			data: { status },
			include: { sweet: true, user: true },
		});
		res.json({ message: "Order status updated", order: updated });
	} catch {
		res.status(404).json({ error: "Order not found" });
	}
});

export default router;
