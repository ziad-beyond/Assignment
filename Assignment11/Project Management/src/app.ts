import express from 'express';
import authRoute from './routes/authRoutes'; 
import projectsRoute from './routes/projectRoutes'; 
import errorHandler from './middleware/errorHandler';


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Project management API');
});
app.use('/', authRoute); 
app.use('/', projectsRoute);

app.use(errorHandler);

export default app;