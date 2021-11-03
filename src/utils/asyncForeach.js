const asyncForeach = async (array, cb) => {
    for (let index = 0; index < array.length; index++) {
        await cb(array[index], index);
    }
};
module.exports = asyncForeach;
