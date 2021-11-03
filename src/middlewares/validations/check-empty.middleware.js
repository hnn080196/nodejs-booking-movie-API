const checkEmptyUser = (req, res, next) => {
    const { name, email, password, phone, role } = req.body;
    if (name && email && password && phone && role) {
        next();
    } else {
        res.status(400).send('Bad Request!!');
    }
};

module.exports = {
    checkEmptyUser,
};
