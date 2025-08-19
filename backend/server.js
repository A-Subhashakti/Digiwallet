const express = require('express');
const dotenv = require('dotenv');
const dbconnect = require('./database/index');
const routes = require('./routes');                    
const { errorHandler } = require('./middleware/errorMiddleware');

const cors = require('cors');


dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));



dbconnect();


app.use(express.json());


app.use('/api', routes);


app.get('/', (req, res) => {
  res.send('Hello from Express! DigiWallet backend is running.');
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
