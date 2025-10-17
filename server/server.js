import express from 'express';
import http, { Server } from 'http';
import { connectDB } from './lib/db.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
app.use(express.json());
app.use(cors());

app.use('/', (req, res) => res.send("Hello from Server"));
app.use('/api/auth', userRouter);
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));