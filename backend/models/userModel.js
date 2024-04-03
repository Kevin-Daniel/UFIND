const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// static signup method
userSchema.statics.signup = async function(firstName, lastName, email, password) {
    if(!firstName || firstName == "") {
        throw Error('First name required');
    }
    if(!lastName || lastName == "") {
        throw Error('Last name required');
    }

    const exists = await this.findOne({email});

    if(exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ firstName, lastName, email, password: hash });

    return user;
};

module.exports = mongoose.model('User', userSchema);