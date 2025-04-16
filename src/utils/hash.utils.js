const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    

    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
    console.log('Comparing password:', password); // Add this
    console.log('With hash:', hash);  
    return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
