import jwt, { SignOptions } from "jsonwebtoken";

const SECRET: string = process.env.JWT_SECRET || "changeme";

export function signJwt(
	payload: object,
	expiresIn: SignOptions["expiresIn"] = "7d"
): string {
	const options: SignOptions = { expiresIn };
	return jwt.sign(payload, SECRET, options);
}

export function verifyJwt<T = any>(token: string): T {
	return jwt.verify(token, SECRET) as T;
}
