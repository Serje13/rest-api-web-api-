const fs = require("fs-extra");
const multer = require("multer");
const config = require("../../../config");

const maxSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            // console.log("FILE FROM DISK STORAGE - ", file);
            //console.log("REQ BODY FROM DISK STORAGE - ", req.body);
            const folder = req.body.order_id;
            let path = `${config.uploadPath}${folder}`;
            let name = file.originalname.replace(/ /g, "-");
            let fileExist = await fs.pathExists(path + "/" + name);

            if (fileExist)
                return cb(new Error(`File ${file.originalname} is already Exist!!!`));
            let pathExist = await fs.pathExists(path);
            if (!pathExist)
                await fs.ensureDir(path);
            //console.log("fileExist - ", fileExist);
            //console.log("pathExist - ", pathExist);
            //console.log("PATH AFTER FS", path);
            await cb(null, path);
        } catch (err) {
            console.log("ERROR during SETTING IMAGE PATH - ", err);
        }
    },
    filename: async (req, file, cb) => {
        try {
            let fileName = file.originalname.replace(/ /g, "-");
            await cb(null, fileName);
        } catch (err) {
            console.log("ERROR during SETTING IMAGE NAME - ", err);
        }
    }
});

const filter = (req, file, cb) => {
    console.log("FILE FROM FILE FILTER - ", file.mimetype);
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg")
        return cb(new Error("Only pngs, jpgs are allowed"));
    cb(null, true);
};


const upload = multer({storage: storage, fileFilter: filter, limits: {fileSize: maxSize}});
const uploader = upload.array("data", 10);

module.exports = uploader;