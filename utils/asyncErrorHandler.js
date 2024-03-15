


module.exports = (func) => {
    return (req, res, next) => {
        func(req, res).catch(err => {
            return res.status(400).json({ error: err.message });
        })
    }
}