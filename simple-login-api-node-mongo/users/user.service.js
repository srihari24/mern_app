const config = require('config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const errorHandler = require('../_helpers/error-handler')
const User = db.User;
const LoginHistory = db.LoginHistory

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getUserLoginHistory,
    logout
};

async function authenticate({ username, password, ipAddress }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        await registerLoginTime(ipAddress, user.id, token)
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function registerLoginTime(ip, id, token) {
    const loginHistory = new LoginHistory({ userId: id, ipAddress: ip, loginTime: new Date(), token: token });
    await loginHistory.save();
    getUserLoginHistory(id)
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getUserLoginHistory(role) {
    if (role !== 'Auditor') {
        const error = new Error();
        error.name = "UnauthorizedError";
        error.code = 401;
        throw (error);
    }
    let logins = await LoginHistory.find().select('-hash');
    let users = await User.find().select('-hash');

    let newData = []

    users.map((user) => {
        logins.map((login) => {
            if (login.userId === user.id) {
                let data = {
                    id: user.id,
                    fullName: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                    loginTime: login.loginTime,
                    logoutTime: login.logoutTime,
                    ipAddress: login.ipAddress
                }
                newData.push(data)
            }
        })
    })
    return newData
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    let res = await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function logout(payload) {
    const login = await LoginHistory.findOne({ token: payload.token });

    if (!login) throw 'Session not found';
    login.logoutTime = new Date()
    Object.assign(login, login);
   await login.save();

}
