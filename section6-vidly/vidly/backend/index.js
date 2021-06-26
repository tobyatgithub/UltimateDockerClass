const app = require("./app");
const db = require("./db");

db.connect().then(() => {
  console.log("Connected to MongoDB: " + db.url);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on port ${port}...`));
