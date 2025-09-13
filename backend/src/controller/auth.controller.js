const { db, logErr } = require("../util/helper");
const bcrypt = require("bcrypt");
const { getAccessToken } = require("../middleware/jwt_token");

//getlist
exports.getlist = async (req, res) => {
    try {
        let sql =
            `select
                u.id,
                u.role_id, 
                u.name, 
                u.username, 
                u.create_by, 
                u.is_active, 
                r.name as role_name 
            from users u 
            inner join roles r on u.role_id = r.id`;
        const [list] = await db.query(sql);
        const [role] = await db.query("select id as value, name as label from roles");
        res.json({
            data: list,
            roles: role,
            message: "success"
        })
    }
    catch (error) {
        logErr("auth.getlist", error, res);
    }
};
//register
exports.register = async (req, res) => {
    try {
        const { password, role_id, name, username, is_active, create_by } = req.body;

        // Validate required fields
        if (!password || !role_id || !name || !username) {
            return res.status(400).json({
                error: true,
                message: "Missing required fields"
            });
        } 
        //ceck username exist
        const checkSql = `SELECT id FROM users WHERE name = :name OR username = :username LIMIT 1`;
        const [existingUsers] = await db.query(checkSql, { name, username });

        if (existingUsers.length > 0) {
            return res.status(400).json({
                error: true,
                message: "Username or name combination already exists"
            });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const InsertSql = `INSERT INTO users (  
            role_id,
            name,
            username,
            password,
            is_active,
            create_by 
        ) VALUES (  
            :role_id,
            :name,
            :username,
            :password,
            :is_active,
            :create_by
        )`;

        const [result] = await db.query(InsertSql, {
            role_id,
            name,
            username,
            password: hashedPassword,
            is_active: is_active ?? 1, // Default to active if not specified
            create_by: create_by || 'system' // Default to system if not specified
        });

        res.json({
            data:{id: result.insertId,username,name},
            message: "User registered successfully",
            error: false
        });
    } catch (error) {
        logErr("auth.register", error, res);
        res.status(500).json({
            message: "Failed to register user",
            error: true
        });
    }
};
//login
exports.login = async (req, res) => {
    try {
        let { username, password } = req.body;
        let sql =
            " select " +
            " u.*," +
            " r.name as role_name," +
            " r.permission as role_permission" +
            " from users u " +
            " inner join roles r on u.role_id = r.id" +
            " where u.username=:username ";

        let [data] = await db.query(sql, { username: username });
        if (data.length == 0) {
            res.json({
                error: {
                    message: "ឈ្មោះអ្នកប្រើប្រាស់មិនមាន, សូមព្យាយាមម្តងទៀត!"
                }, //pro data
            });
            return;
        }
        else {
            let dbPassword = data[0].password;
            let isMatch = bcrypt.compareSync(password, dbPassword); //this compare true and false pass
            if (!isMatch) {
                res.json({
                    error: { 
                        message: "ពាក្យសម្ងាត់មិត្រឹមត្រូវ, សូមព្យាយាមម្តងទៀត!"
                    }, //pro data
                });
                return;
            }
            else {
                delete data[0].password;
                // Build dynamic permission from roles table
                const roleName = data[0].role_name;
                const rolePermRaw = data[0].role_permission; // may be JSON string or 'all' or null
                let permissionObj = null;
                if (roleName === 'Admin') {
                    permissionObj = { all: true };
                    // surface this indicator on profile for frontend's quick check
                    data[0].permission = 'all';
                } else {
                    try {
                        if (rolePermRaw === 'all') {
                            permissionObj = { all: true };
                            data[0].permission = 'all';
                        } else if (rolePermRaw) {
                            const parsed = typeof rolePermRaw === 'string' ? JSON.parse(rolePermRaw) : rolePermRaw;
                            if (parsed === 'all') {
                                permissionObj = { all: true };
                                data[0].permission = 'all';
                            } else if (parsed && parsed.all === true) {
                                permissionObj = { all: true };
                                data[0].permission = 'all';
                            } else if (parsed && typeof parsed === 'object') {
                                permissionObj = parsed;
                            }
                        }
                    } catch (e) {
                        // ignore parse errors and fallback below
                    }
                    if (!permissionObj) {
                        // default minimal permission for non-admin
                        permissionObj = { pos: true, order: true, customer: true };
                    }
                }
                let obj = {
                    profile: data[0],
                    permission: permissionObj
                }
                res.json({
                    message: "login successfully",
                    ...obj, // include profile and permission in payload
                    // get token
                    access_token: await getAccessToken(obj)
                });
                return;
            }
        }
    }
    catch (error) {
        logErr("auth.login", error, res);
    }
};
//profile
exports.profile = async (req, res) => {
    try {
        res.json({
            profile: req.profile,
            message: "success"
        })
    }
    catch (error) {
        logErr("auth.profile", error, res);
    }
};

//logout
exports.logout = async (req, res) => {
    try {
        //const userId = req.profile; //check this
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expire: new Date(0) //cookie will expire js
        }
        res.clearCookie("access_token", cookiesOption);
        res.status(200).json({
            message: "logout successfully",
            error: "false",
            success: "true"
        });
    }
    catch (err) {
        logErr("auth.logout", err, res);
    }
}
//forgot password
exports.forgot_password = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        let sql = "SELECT * FROM users WHERE email = :email";
        let [user] = await db.query(sql, { email });
        if (user.length === 0) {
            return res.status(400).json({
                message: "Email does not exist",
                error: true,
                success: false
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

        // Store OTP and expiry in database
        let updateSql = "UPDATE users SET forgot_password_otp = :otp, forgot_password_expiry = :expiry WHERE email = :email";
        await db.query(updateSql, { otp, expiry, email });

        // Send OTP to user's email (pseudo-code, replace with your email logic)
        await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 15 minutes.`
        });

        res.status(200).json({
            message: "OTP sent to your email",
            error: false,
            success: true
        })
    }
    catch (err) {
        logErr("auth.forgot_password", err, res);
    }
}

//reset password
exports.reset_password = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate user and OTP
        let sql = "SELECT * FROM users WHERE email = :email";
        let [user] = await db.query(sql, { email });

        if (user.length === 0) {
            return res.status(400).json({
                message: "Email does not exist",
                error: true,
                success: false
            });
        }

        const dbOtp = user[0].forgot_password_otp;
        const dbExpiry = new Date(user[0].forgot_password_expiry);
        if (otp !== dbOtp) {
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Update password in database
        let updateSql = "UPDATE users SET password = :newPassword, forgot_password_otp = NULL, forgot_password_expiry = NULL WHERE email = :email";
        await db.query(updateSql, { newPassword: hashedPassword, email });
        res.status(200).json({
            message: "Password reset successfully",
            error: false,
            success: true
        })
    }
    catch (err) {
        logErr("auth.reset_password", err, res);
    }
}
//verify email
exports.verify_email = async (req, res) => {
    try {
        var data = "email verified";
        res.json({
            data: data,
            message: "success",
            error: false,
        })
    }
    catch (err) {
        logErr("auth.verify_email", err, res);
    }
}
//update
exports.update = async (req, res) => {
    try {
        const { id, role_id, name, username, password, is_active } = req.body;
        //check if username exists
        if (username || name) {
            const checkSql = `SELECT id FROM users WHERE (name = :name OR username = :username) AND id != :id LIMIT 1`;
            const [existingUsers] = await db.query(checkSql, { name, username, id });

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    error: true,
                    message: "Name or Username already exists"
                });
            }
        }
        // Build the SQL query parts
        const updates = [];
        const params = { id };

        // Add non-password fields
        if (role_id !== undefined) {
            updates.push("role_id = :role_id");
            params.role_id = role_id;
        }
        if (name !== undefined) {
            updates.push("name = :name");
            params.name = name;
        }
        if (username !== undefined) {
            updates.push("username = :username");
            params.username = username;
        }
        if (is_active !== undefined) {
            updates.push("is_active = :is_active");
            params.is_active = is_active;
        }

        // Handle password separately
        if (password) {
            updates.push("password = :password");
            params.password = bcrypt.hashSync(password, 10);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                error: true,
                message: "No fields to update"
            });
        }
        // Construct the final SQL query
        const updateSql = `UPDATE users SET ${updates.join(", ")} WHERE id = :id`;
        // const [existingUsers] = await db.query(checkSql, {
        //     name: name || '',
        //     username: username || '',
        //     id
        // });

        // Execute the query
        await db.query(updateSql, params);

        res.json({
            message: "User updated successfully",
            error: false
        });
    } catch (error) {
        logErr("auth.update", error, res);
        res.status(500).json({
            message: "Failed to update user",
            error: true
        });
    }
};
//remove
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        const sql = "DELETE FROM users WHERE id = :id";
        await db.query(sql, { id });

        res.json({
            message: "User deleted successfully",
            error: false
        });
    } catch (error) {
        logErr("auth.delete", error, res);
    }
}
