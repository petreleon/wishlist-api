import { NextFunction } from "express";
import { Request, Response } from "express";

export type permissionType = "blocked" | "user" | "admin" | "superadmin";

export function permissionChecker(minPermission: permissionType, actualPermission: permissionType) {
    const permissionLevels = {
        blocked: 0,
        user: 1,
        admin: 2,
        superadmin: 3
    }

    if (permissionLevels[minPermission] > permissionLevels[actualPermission] && minPermission in permissionLevels && actualPermission in permissionLevels) {
        return false;
    } else {
        return true;
    }
}

export function permissionCheckerMiddleware(minPermission: permissionType) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (permissionChecker(minPermission, req.body.user.permission)) {
            next();
        } else {
            res.status(403).json({
                error: 'Forbidden'
            })
        }
    }
}