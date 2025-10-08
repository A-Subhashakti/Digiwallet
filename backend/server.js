const express = require('express');
const dotenv = require('dotenv');
const dbconnect = require('./database/index');
const routes = require('./routes');                    
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
// const passport = require('passport');
// require('./config/passport'); 

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


dbconnect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const session = require('express-session');
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,          
      sameSite: 'lax',        
    },
  })
);


// app.use(passport.initialize());
// app.use(passport.session());


app.use('/api', routes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use("/api", require("./routes/walletRoutes"));





app.get('/', (req, res) => {
  res.send('Hello from Express! DigiWallet backend is running.');
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
