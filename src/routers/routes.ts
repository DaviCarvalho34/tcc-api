import { Router } from "express";
import * as ElasticSearchController from "../controllers/elasticSearch/elasticSearchController"

const router = Router();

router.get('/stream', ElasticSearchController.bulkIndexHandler);


export default router