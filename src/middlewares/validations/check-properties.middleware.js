const checkExactProperties = (keys) => async (req, res) => {
  try {
    const propsList = Object.keys(req.body);
    const isValidOperation = propsList.every((update) => keys.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ error: "Format sai" });
    }
    next();
  } catch (error) {
    res.status(500).send({
      message: "Lỗi Server",
    });
  }
};

module.exports = {
  checkExactProperties,
};
