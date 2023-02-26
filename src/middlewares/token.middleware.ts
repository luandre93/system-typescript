import * as jwt from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';

interface Payload {
    userId: string;
    username: string;
}

export class TokenMiddleware {
    verifyToken = (req: Request, res: Response, next: NextFunction) => {
        const secret: jwt.Secret = "5094265240";
        const token: string | undefined = req.header('Authorization');
        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }
        try {
            const decoded = jwt.verify(token, secret);
            req.body.username = decoded;
            next();
        } catch (err) {
            return res.status(400).send('Invalid token.');
        }

    }
}





/*
 const verifyToken = (req: Request, res: Response, next: NextFunction) => {
            // Recuperar o token do cabeçalho da solicitação
            const token = req.header('Authorization');

            if (!token) {
                return res.status(401).send('Access denied. No token provided.');
            }

            try {
                const decoded = jwt.verify(token, secretKey);
                req.user = decoded;
                next();
            } catch (err) {
                return res.status(400).send('Invalid token.');
            }
        };

*/