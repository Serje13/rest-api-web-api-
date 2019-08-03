const userNormalizer = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email
    };
};

const filesNormalizer = (f) => {
    let path = f.path.replace(/\\/g, "/");
    let url = "http://localhost:3000/" + path;
    return {
        image: {
            name: f.filename,
            url
        }
    };
};
const fileNormalizer = (f) => {
    let path = f.path.replace(/\\/g, "/");
    let url = "http://localhost:3000/" + path;
    return {
        image: {
            name: f.filename,
            url
        }
    };
};

const getFilesNames = (id, order) => {
    console.log("id FROM FUNC -", id);
    console.log("order FROM FUNC -", order);
    const data = order.data;
    for (let i = 0; i < data.length; i++)
        if (data[i]._id == id) return data[i].image.name;
};

module.exports = {
    userNormalizer,
    filesNormalizer,
    fileNormalizer,
    getFilesNames
};