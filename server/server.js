const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port, (error) => {
    if (error) {
        console.error("Error connecting");
        process.exit(0);
    }
    console.log(`Server connected to ${port}`);
});
