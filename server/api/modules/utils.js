const userNormalizer = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email
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

module.exports = {
    userNormalizer,
    fileNormalizer
};