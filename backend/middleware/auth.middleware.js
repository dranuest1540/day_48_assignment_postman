import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token tidak ditemukan"
            });
        }

        const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);

        if (scheme?.toLowerCase() !== "bearer" || !token || extraParts.length > 0) {
            return res.status(401).json({
                success: false,
                message: "Format token tidak valid"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah expired"
        });
    }
};

export default authenticate;