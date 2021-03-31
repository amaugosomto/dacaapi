const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./models/index');
const fileupload = require('express-fileupload');

const usersRoutes = require('./routes/users.routes');
const adminUsersRoutes = require('./routes/adminUser.route');
const classesRoutes = require('./routes/class.route');
const sermonsRoutes = require('./routes/sermon.route');
const eventsRoutes = require('./routes/event.route');

var whitelist = ['http://localhost:4000', 'https://daca-ng.vercel.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

const port = process.env.PORT || 5000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(helmet());
app.use(morgan('tiny'));
// app.use(fileupload());

db.sequelize.authenticate()
  .then(() => console.log("successfully connected sequelize"))
  .catch(err => { console.error("error connecting to db", err) });

// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});

app.use('/api/users', usersRoutes);
app.use('/api/adminUser', adminUsersRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/sermons', sermonsRoutes);
app.use('/api/events', eventsRoutes);
// Require testimonial routes
//const testimonialRoutes = require('./routes/testimonial.routes');

// using as middleware
//app.use('/api/testimonials', testimonialRoutes)


// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});