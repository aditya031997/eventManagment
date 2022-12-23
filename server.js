const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json());
dotenv.config({ path: './.env' })

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log(`Connected to MongoDb succesfully....`)
}).catch((error) => {
    console.error(error)
    process.exit(1)
})

const hostName = process.env.LOCAL_HOST_NAME
const port = process.env.LOCAL_PORT

app.use((req, res, next) => {
    if (req.originalUrl != "/")
      console.log({ url: req.originalUrl }, { body: req.body });
    next();
  });

  app.use("/tmp", express.static("tmp"));

app.get('/', (req, res) => {
    res.send(`welcome to Events booking app `)
})

app.use('/api/users', require('./router/userRouter'))
app.use('/api/event', require('./router/eventRouter'))

app.listen(port, hostName, () => {
    console.log(`server is running at http://${hostName}:${port}`)
})

