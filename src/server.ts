import dotenv from 'dotenv';

dotenv.config()
import express from 'express';
const app = express();
import ElasticSearchRouter from './routers/routes';
import PostgresRouter from './routers/postgresRouter';
import envSchema from './schemas/Env';
export const ENV = envSchema.parse(process.env)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const router = express.Router();
app.use('/api', router);

app.use('/elastic', ElasticSearchRouter)
app.use('/postgres', PostgresRouter)

app.listen("8000", () => {
    console.log('Server is running on port 8000');
})