//const fs = require("fs");
const fs = require("fs-extra");
const multer = require("multer");
const config = require("../../../config");

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            console.log("FILE FROM DISK STORAGE - ", file);
            console.log("REQ BODY FROM DISK STORAGE - ", req.body);
            const folder = req.body.order_id;
            let path = `${config.uploadPath}${folder}`;
            //let fileExist = await fs.existsSync(path + "/" + file.originalname);
            let fileExist = await fs.pathExists(path + "/" + file.originalname);
            //console.log("fileExist - ", fileExist);
            if (fileExist)
                return cb(new Error(`File ${file.originalname} is already Exist!!!`));
            let pathExist = await fs.pathExists(path);
            if (!pathExist)
                await fs.ensureDir(path);
            console.log("fileExist - ", fileExist);
            console.log("pathExist - ", pathExist);
            console.log("PATH AFTER FS", path);
            await cb(null, path);
        } catch (err) {
            console.log("ERROR during SETTING IMAGE PATH - ", err);
        }
    },
    filename: async (req, file, cb) => {
        try {
            let fileName = file.originalname.replace(/ /g, "-");;
            await cb(null, fileName);
        } catch (err) {
            console.log("ERROR during SETTING IMAGE NAME - ", err);
        }
    }
});

const upload = multer({storage: storage});
const uploader = upload.array("data", 10);

module.exports = uploader;