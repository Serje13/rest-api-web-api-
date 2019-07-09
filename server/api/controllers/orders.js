const Order = require("../models/order");

const ASC = "ASC";
const getAll = async (req, res) => {
    console.log("REQ QUERY -", req.query);
    try {
        const {_end, _start, q, _sort, _order} = req.query;
        if (_end && _start || q || _sort && _order) {
            const start = Number(_start);
            const end = Number(_end);
            const queryConditions = {"data.name": {$regex: q || "", $options: "i"}}; // conditions
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
            res.status(200).send({results, message: "The orders successfully found!!!"});
        }
    } catch (err) {
        console.log("ERROR during getting All Orders - ", err);
        res.sendStatus(400);
    }
};

const create = async (req, res) => {
    try {
        const {order_id, data} = req.body;
        let result = await Order.create({
            order_id,
            data
        });
        console.log(
            `Order Id:${result._id}  successfully Created!!`
        );
        console.log(results);
        res.status(200).send({result, message: "Order successfully CREATED!!!"});
    } catch (err) {
        console.log("ERROR during creating New Order - ", err);
        res.sendStatus(400);
    }
};

const remove = async (req, res) => {
    try {
        const _id = req.params._id;
        await Order.findByIdAndRemove(_id);
        console.log(`Order Id: ${_id} successfully DELETED!!!`);
        res.status(200).send({message: "Order successfully DELETED!!!"});
    } catch (err) {
        console.log("ERROR during deleting Order - ", err);
        res.sendStatus(400);
    }
};

const update = async (req, res) => {
    try {
        const {_id, order_id, data} = req.body;
        let result = await Order.findOneAndUpdate(
            {_id},
            {order_id, data},
            {new: true}
        );
        console.log(`Order ${result._id} successfully Updated!`);
        res.status(200).send({data: result, message: "Order successfully Updated!!!"});
    } catch (err) {
        console.log("ERROR during ORDER updating - ", err);
        res.sendStatus(400);
    }
};

const findOne = async (req, res) => {
    try {
        const _id = req.params.id;
        let result = await Order.findOne({_id});
        console.log(`Order ${result._id} successfully Found!`);
        res.status(200).send({data: result, message: "Order successfully FOUND!!!"});
    } catch (err) {
        console.log("ERROR during finding ORDER - ", err);
        res.sendStatus(400);
    }
};

module.exports = {
    getAll,
    remove,
    create,
    findOne,
    update
};