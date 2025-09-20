import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthRequest extends Request {
	user?: any;
}

export const authenticate = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const auth = req.headers.authorization;
	if (!auth?.startsWith("Bearer "))
		return res.status(401).json({ error: "Unauthorized" });
	const token = auth.split(" ")[1];
	try {
		const payload = verifyJwt(token);
		req.user = payload;
		next();
	} catch (e) {
		return res.status(401).json({ error: "Invalid token" });
	}
};

export const requireAdmin = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.user?.role !== "ADMIN")
		return res.status(403).json({ error: "Admin only" });
	next();
};
