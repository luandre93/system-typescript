import express, { Response } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import {
    getAllUsers,
    getUserById,
    updateUser,
    postUser,
    delUserById,
    getAllGroupAndUsers,
    getUserByUsername,
    getUserAndGroup
} from '../database/dal/users.dal';
getAllGroupAndUsers

const version: string = "api/v1"

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {

        /** 
         *   @Get de usuario por "ID" ou por "Nome".
         */

        this.app.route(`/${version}/user`)
            .get(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const username: string = String(req.query.username);
                    const userId: number = Number(req.query.id);
                    let result;

                    if (username) {
                        result = await getUserByUsername(username);
                        if (!result) {
                            res.status(404).send(`User not found for username: ${username}`);
                            return;
                        }
                    } else if (userId) {
                        result = await getUserById(userId);
                        if (!result) {
                            res.status(404).send(`User not found for id: ${userId}`);
                            return;
                        }
                    } else {
                        res.status(400).send("Both username and id parameters are missing");
                        return;
                    }
                    res.status(200).send(result);
                } catch (err: any) {
                    res.status(500).send(err.message);
                }
            })

        /** 
         *   @Post de usuário, Definição padrão como "nivel 0" (usuário) e implantação de "session" em branco.
         */

        this.app.route(`/${version}/user`)
            .post(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const { username, email, permitted } = req.body;
                    if (!username) {
                        return res.status(400).send({ error: 'Campo do usuário requer ser preenchido.' });
                    }
                    const result = await postUser({ username, email, permitted });
                    res.status(201).send(result);
                } catch (err: any) {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        return res.status(400).send({ error: 'Usuário já existe na base de dados.' });
                    }
                    return res.status(500).send({ error: 'Um erro ocorreu na criação do usuário.' });
                }
            });

        /** 
         *   @Delete de usuario por "ID".
         */

        this.app.route(`/${version}/user/:id`)
            .delete(async (req: express.Request, res: express.Response): Promise<void> => {
                try {
                    const userId: number = Number(req.params.id);
                    const result: Promise<any> = await delUserById(userId);
                    if (await result) {
                        res.status(204).end();
                    }
                    else {
                        res.status(404).send(`Not found user with id: ${userId}.`)
                    }
                } catch (err: any) {
                    res.status(500).send(err);
                }
            });

        /** 
         *   @Update de usuario por "ID".
         */

        this.app.route(`/${version}/user`)
            .put(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const { id, username, email, permitted } = req.body;
                    if (!username) {
                        return res.status(400).send({ error: 'Campo do usuário requer ser preenchido.' });
                    }
                    const result = await updateUser({ id, username, email, permitted });
                    res.status(201).send(result);
                } catch (error) {
                    res.status(500).send({ error: 'Internal server error' });
                }
            })

        /** 
         *   @Get de todos "Usuários".
         */

        this.app.route(`/${version}/users`)
            .get(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const users = await getAllUsers();
                    if (!users) {
                        res.status(404).send("No users found");
                        return;
                    }
                    res.status(200).send(users);
                } catch (err: any) {
                    console.error(err);
                    res.status(500).send("An error occurred while fetching the users");
                }
            })

        /** 
         *   @Get de todos "Usuários" por "Grupo" e "Sessão".
         */

        this.app.route(`/${version}/getAllUsersAndGroup`)
            .get(async (req: express.Request, res: express.Response): Promise<void> => {
                try {
                    const groupsAndUsers = await getAllGroupAndUsers();
                    res.status(200).send(groupsAndUsers);
                } catch (error) {
                    res.status(500).send({ error: 'Internal server error' });
                }
            });

        /** 
         *   @Get de um "Usuário" por "Grupo" e "Sessão" definido pelo nome.
         */

        this.app.route(`/${version}/getUserAndGroup`)
            .get(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const username: string = String(req.query.username);
                    if (!username) {
                        res.status(400).send({ error: 'Missing username in query' });
                        return;
                    }
                    const result = await getUserAndGroup(username);
                    if (!result) {
                        res.status(404).send({ error: 'User not found' });
                        return;
                    }
                    res.status(200).send(result);
                } catch (error) {
                    console.error(error);
                    res.status(500).send({ error: 'Internal server error' });
                }
            })

        return this.app;
    }
}