const { db } = require("../../util/helper");
const jwt = require("jsonwebtoken");
const config = require("../../util/config");

exports.admin = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                message: "unauthorized: No userId provided...",
                error: true,
                success: false
            });
        }
        const sql = "select * from users where id=?";
        //const sql = "select * from users where id=:id and role_id=1"; //check this when something erroer
        const [users] = await db.query(sql, { id: userId });
        if (users.length == 0) {
            return res.status(404).json({
                message: "user is not admin...",
                error: true,
                success: false
            });
        }
        const user = users[0];
        if (user.roles != 'Admin') {
            return res.status(403).json({
                message: "permission denied: Admin access required...",
                error: true,
                success: false
            })
        }
        next(); //continue
    }
    catch (err) {
        return res.status(500).json({
            message: "unauthorized: No userId provided...",
            error: true,
            success: false
        })
    }
};


//auth admin middleware
exports.adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access. Token is missing.",
                error: true,
                success: false,
            });
        }

        // Verify the token
        jwt.verify(token, config.config.token.access_token_key, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid token. Access denied.",
                    error: true,
                    success: false,
                });
            }

            const userId = decoded.data.profile.id; // Assuming the token contains the user profile

            // Fetch user from the database
            const sql = "SELECT * FROM users WHERE id = :userId";
            const [user] = await db.query(sql, { userId });

            if (!user || user.length === 0) {
                return res.status(404).json({
                    message: "User not found.",
                    error: true,
                    success: false,
                });
            }

            // Check if the user's role is ADMIN
            const userRole = user[0].role_id; // Assuming role_id indicates role type
            const roleCheckSQL = "SELECT * FROM roles WHERE id = :roleId AND name = 'ADMIN'";
            const [role] = await db.query(roleCheckSQL, { roleId: userRole });

            if (!role || role.length === 0) {
                return res.status(403).json({
                    message: "Access denied. Only admins are allowed.",
                    error: true,
                    success: false,
                });
            }

            // Pass user info to the next middleware/controller
            req.profile = user[0];
            next();
        });
    } catch (error) {
        logErr("auth.adminAuth", error, res);
        res.status(500).json({
            message: "Server error. Please try again later.",
            error: true,
            success: false,
        });
    }
};

//and import this middleware in routes
const express = require("express");
const { adminAuth } = require("../middleware/authMiddleware"); // Adjust path as needed
const router = express.Router();

// Admin-only route
router.get("/admin/dashboard", adminAuth, (req, res) => {
    res.json({
        message: "Welcome to the admin dashboard!",
        profile: req.profile, // Admin's profile information
    });
});

module.exports = router;
