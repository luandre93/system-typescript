import { postRules, getAllRules, getRules } from "../database/dal/rules.dal";
import { CommonRoutesConfig } from '../common/common.routes.config';
import { IUserSession } from '@/interfaces/rules.interface'
import express from 'express';

export class RulesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'RulesRoutes');
    }

    configureRoutes() {
        const version: string = "api/v1";

        this.app.route(`/${version}/rules`)
            .get(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    res.status(200).send(await getAllRules());
                } catch (err: any) {
                    res.status(500).send(err.name);
                }
            })

        this.app.route(`/${version}/rule`)
            .post(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const userSessions: IUserSession = req.body.user_sessions;
                    const result: string = await postRules(userSessions)
                    res.status(200).send(result)
                } catch (err: any) {
                    res.status(500).send(err);
                }
            })

        this.app.route(`/${version}/rules:usersessions`)
            .get(async (req: express.Request, res: express.Response): Promise<any> => {
                try {
                    const userSessions: string = req.query.username as unknown as string;
                    res.status(200).send(await getRules(userSessions));
                } catch (err: any) {
                    res.status(500).send(err.name);
                }
            })

        return this.app
    }
}