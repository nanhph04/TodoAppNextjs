import express, { type Request, type Response, type Application } from 'express';
import indexRouter from './routes/index.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';
import morgan from 'morgan';
import connectDB from './configs/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', indexRouter);

const startServer = async () => {
    try {
        await connectDB(MONGODB_URI!);
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

startServer();