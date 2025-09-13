function checkPermission(permissionKey) {
    return (req, res, next) => {
        const rolePermissions = req.user?.role?.permissions;

        if (!rolePermissions || rolePermissions[permissionKey] !== true) {
            return res.status(403).json({ message: "Access denied." });
        }

        next(); // User has permission, continue to route
    };
}

module.exports = checkPermission;
