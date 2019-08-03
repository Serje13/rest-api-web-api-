const Order = require("../models/order");
const uploader = require("../modules/uploader/uploader");
const multer = require("multer");
const fs = require("fs-extra");
const config = require("../../config");
const utils = require("../modules/utils");

const ASC = "ASC";
const getAll = async (req, res) => {
    console.log("REQ QUERY FROM ORDERS-", req.query);
    try {
        const {_end, _start, q, _sort, _order, token} = req.query;
        if (_end && _start || q || _sort && _order) {
            const start = Number(_start);
            const end = Number(_end);
            const queryConditions = {"data.image.name": {$regex: q || "", $options: "i"}}; // conditions
            const total = await Order.find(queryConditions).countDocuments();
            let results = await Order.find(queryConditions)
                .skip(start)
                .limit(end - start)
                .sort({[_sort]: _order === ASC ? 1 : -1});
            console.log("WITH CONDITIONS - ", results);
            res.set("X-TOTAL-COUNT", total);
            res.status(200).send({results, message: "The orders successfully found!!!"});
        } else {
            const total = await Order.find({}).countDocuments();
            let results = await Order.find({});
            console.log("WITHOUT CONDITIONS - ", results);
            res.set("X-TOTAL-COUNT", total);
            res.status(200).send({data: results, message: "The orders successfully found!!!"});
        }
    } catch (err) {
        console.log("ERROR during getting All Orders - ", err);
        res.sendStatus(500);
    }
};

const create = async (req, res) => {
    try {
        await uploader(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.log("ERROR FROM DISK STORAGE - ", err);
                return res.status(400).send({message: err.message});
            }
            // A Multer error occurred when uploading.
            else if (err) {
                console.log("ERROR FROM DISK STORAGE NOT MULTER -", err.message);
                return res.status(400).send({message: err.message});
            }
            // An unknown error occurred when uploading.
            console.log("FILES FROM TESTING POSTmAn - ", req.files);
            const order_id = Number(req.body.order_id);
            let data = req.files;
            data = await data.map(f => utils.filesNormalizer(f));
            let result = await Order.create({
                order_id,
                data
            });
            console.log(
                `Order Id:${result._id}  successfully Created!!`
            );
            console.log(result);
            res.status(200).send({data: result, message: "Order successfully CREATED!!!"});
            //res.status(200).send({data, message: "Order successfully CREATED!!!"});
        });
    } catch (err) {
        console.log("ERROR during creating New Order - ", err);
        res.sendStatus(500);
    }
};

const remove = async (req, res) => {
    try {
        console.log(req.params.id);
        const _id = req.params.id;
        const order = await Order.findOne({_id});
        const folder = order.order_id;
        console.log("FOLDER - ", folder);
        const path = `${config.uploadPath}${folder}`;
        console.log("PATH  - ", path);
        await fs.remove(path);
        await Order.findByIdAndRemove({_id: order._id});
        res.status(200).send({message: "Order successfully DELETED!!!"});
    } catch (err) {
        console.log("ERROR during deleting Order - ", err);
        res.sendStatus(500);
    }
};

const removeImage = async (req, res) => {
    try {
        console.log("REQ BODY FROM UPDATE", req.body);
        const {_id, order_id, name, image_id} = req.body;
        const path = `${config.uploadPath}${order_id}/${name}`;
        await fs.remove(path);
        console.log("_id - ", _id);
        console.log("order_id - ", order_id);
        let result = await Order.findOneAndUpdate(
            {_id},
            {$pull: {data: {_id: image_id}}},
            {new: true}
        );
        console.log("result - ", result);
        res.status(200).send({data: result, message: "Order successfully Updated"});
    } catch (err) {
        console.log("ERROR during ORDER updating - ", err);
        res.sendStatus(500);
    }
};

const changeImage = async (req, res) => {
    try {
        await uploader(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.log("ERROR FROM DISK STORAGE - ", err);
                return res.status(400).send({message: err.message});
            }
            else if (err) {
                console.log("ERROR FROM DISK STORAGE NOT MULTER -", err.message);
                return res.status(400).send({message: err.message});
            }
            console.log("FILES FROM CHANGE IMAGE - ", req.files);
            console.log("req body from change imaGE - ", req.body);
            const {_id, order_id, name, image_id} = req.body;
            const path = `${config.uploadPath}${order_id}/${name}`;
            await fs.remove(path);
            let data = req.files[0];
            console.log("data - ", data);
            data = await utils.fileNormalizer(data);
            console.log("data - ", data);
            let result = await Order.findOneAndUpdate(
                {_id},
                {$set: {"data.$[image]": data}},
                {
                    arrayFilters: [{
                        "image._id": image_id
                    }], new: true
                }
            );
            console.log(result);
            console.log(`Order ${result._id} successfully Updated!`);
            res.status(200).send({data: result, message: "Order successfully Updated!!!"});
        });
    } catch (err) {
        console.log("ERROR during ORDER updating - ", err);
        res.sendStatus(500);
    }
};

const addImage = async (req, res) => {
    try {
        await uploader(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.log("ERROR FROM DISK STORAGE - ", err);
                return res.status(400).send({message: err.message});
            }
            else if (err) {
                console.log("ERROR FROM DISK STORAGE NOT MULTER -", err.message);
                return res.status(400).send({message: err.message});
            }
            console.log("FILES FROM CHANGE IMAGE - ", req.files);
            console.log("req body from change imaGE - ", req.body);
            const {_id, order_id} = req.body;
            const path = `${config.uploadPath}${order_id}`;
            let data = req.files[0];
            console.log("data - ", data);
            data = await utils.fileNormalizer(data);
            console.log("data - ", data);
            let result = await Order.findOneAndUpdate(
                {_id},
                {$push: {data}},
                {new: true}
            );
            console.log(result);
            console.log(`Order ${result._id} successfully Updated!`);
            res.status(200).send({data: result, message: "Order successfully Updated!!!"});
        });
    } catch (err) {
        console.log("ERROR during ORDER updating - ", err);
        res.sendStatus(500);
    }
};

const findOne = async (req, res) => {
    try {
        const _id = req.params.id;
        console.log("_ID  - ", _id);
        let result = await Order.findOne({_id});
        console.log("result  - ", result);
        console.log(`Order ${result._id} successfully Found!`);
        res.status(200).send({data: result, message: "Order successfully FOUND!!!"});
    } catch (err) {
        console.log("ERROR during finding ORDER - ", err);
        res.sendStatus(500);
    }
};

module.exports = {
    getAll,
    remove,
    create,
    findOne,
    removeImage,
    changeImage,
    addImage
};