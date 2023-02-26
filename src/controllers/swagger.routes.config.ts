import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../swagger.json";

export class SwaggerRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'PrintersRoutes');
    }
    configureRoutes() {
        this.app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        return this.app;
    }
}