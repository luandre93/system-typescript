import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import VERSION_API from '@/common/version.config';
export class PrintersRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'PrintersRoutes');
    }

    configureRoutes() {
        this.app.route(`/printers`)
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`List of users`);
            })
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send(`Post to users`);
            });

        this.app.route(`/printers/:printerId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {

                next();
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`GET requested for id ${req.params.printerId}`);
            })
            .put((req: express.Request, res: express.Response) => {
                res.status(200).send(`PUT requested for id ${req.params.printerId}`);
            })
            .patch((req: express.Request, res: express.Response) => {
                res.status(200).send(`PATCH requested for id ${req.params.printerId}`);
            })
            .delete((req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE requested for id ${req.params.printerId}`);
            });

        return this.app;
    }
}