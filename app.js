const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const packages = {
    "ExamplePackage": {
        scripts: [
            {
                name: "ExampleScript",
                type: "Script",
                code: "print('This is an example script!')"
            },
            {
                name: "ExampleModule",
                type: "ModuleScript",
                code: "return { foo = function() print('Hello from module!') end }"
            }
        ]
    }
};

app.get('/packages/:packageName', (req, res) => {
    const packageName = req.params.packageName;
    const packageData = packages[packageName];
    if (packageData) {
        res.json(packageData);
    } else {
        res.status(404).send('Package not found');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
