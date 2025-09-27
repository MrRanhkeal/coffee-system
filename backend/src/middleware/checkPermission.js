function checkPermission(permissionKey) {
    return (req, res, next) => {
        // Normalize permission source from various middlewares
        const perms =
            req.permission ||
            req.permision ||
            req.auth?.permission ||
            req.profile?.permission ||
            req.user?.role?.permissions;

        // Grant all if 'all' flag present
        if (perms === 'all' || perms?.all === true) {
            return next();
        }

        if (!perms) {
            return res.status(403).json({ message: "Access denied." });
        }

        const keys = Array.isArray(permissionKey) ? permissionKey : [permissionKey];
        const allowed = keys.some((k) => perms?.[k] === true);

        if (!allowed) {
            return res.status(403).json({ message: "Access denied." });
        }

        next(); // User has permission, continue to route
    };
}

module.exports = checkPermission;
// also expose named export for cases where code does `{ checkPermission } = require(...)`
module.exports.checkPermission = checkPermission;
