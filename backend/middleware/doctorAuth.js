const doctorAuth = (req, res, next) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ msg: 'Access denied, doctor only' });
    }
    next();
};

module.exports = doctorAuth;