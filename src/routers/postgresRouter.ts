import { Router } from "express";
import * as InsertController from "../controllers/insertController"

const routerPg = Router();

routerPg.post('/generate-data', InsertController.bulkInsertHandler);



export default routerPg