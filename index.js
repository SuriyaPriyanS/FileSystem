import express from "express";
import path from "path";
import fs from "fs";

// Define the output folder
const outfolder = "output";

// Ensure the output folder exists
if (!fs.existsSync(outfolder)) {
    fs.mkdirSync(outfolder);
}

const PORT = 3000;
const app = express();

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post("/createtextfile", (req, res) => {
    const currentTime = new Date();
    const year = currentTime.getFullYear().toString();
    const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    const date = currentTime.getDate().toString().padStart(2, '0');
    const hrs = currentTime.getHours().toString().padStart(2, '0');
    const min = currentTime.getMinutes().toString().padStart(2, '0');
    const sec = currentTime.getSeconds().toString().padStart(2, '0');

    const dateTimeForFileName = `${year}-${month}-${date}-${hrs}${min}-${sec}.txt`;

    const filePath = path.join(outfolder, dateTimeForFileName);

    fs.writeFile(filePath, currentTime.toISOString(), (err) => {
        if (err) {
            res.status(500).send(`Error creating file: ${err}`);
            return;
        }

        res.send(`File created successfully at: ${filePath}`);
    });
});

app.get('/getTextFiles', (req, res) => {
    fs.readdir(outfolder, (err, files) => {
        if (err) {
            res.status(500).send(`Error reading directory: ${err}`);
            return;
        }

        console.log("List of files:\n", files);

        const textFiles = files.filter((file) => path.extname(file) === ".txt");

        res.json(textFiles);
    });
});
