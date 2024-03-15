


module.exports = (func) => {
    return (req, res, next) => {
        func(req, res).catch(err => {
            // console.log("its from me");
            // console.log(err);
            return res.status(400).json({ error: err.message });
            // next();
        })
    }
}