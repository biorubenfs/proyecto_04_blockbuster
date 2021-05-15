import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
// The above import is neccessary for populate but i dont know why
import displayGandalf from '../utils/displayGandalf.js';
import Bcryp from 'bcrypt';
import { request } from 'express';

// This controller groups all methods related to users.
export const userController = {
    listUsers: async (req, res) => {

        try {
            const resUsers = await User.find().populate('roleId', 'role');
            res.json(resUsers);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }

    },

    findUser: async (req, res) => {

        try {
            const query = req.params.id;
            const resUser = await User.findById(query);
            res.json(resUser);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }

    },

    viewUserProfile: async (req, res) => {

        try {
            const queryBody = req.body.email;

            // We can use de req object that we modified in checkUser
            const queryToken = req.userChecked;

            if (queryToken.email !== queryBody) {
                displayGandalf(req, res);
            } else {
                const userProfile = await User.findOne({ "email": queryBody });
                const orders = await Order.find({ "userId": userProfile._id });
                const fullResult = { "profile": userProfile, "orders": orders };
                res.json(fullResult);
            }
        } catch (error) {

            res.status(400).send({ message: error.message });
        }

    },

    // Create user with role USER.
    createUser: async (req, res) => {

        const username = req.body.newUserName;
        const email = req.body.newUserEmail;
        const roleId = process.env.USER_ROLE_ID;
        const password = Bcryp.hashSync(request.body.password, 4);

        // Search if user already exists in db.
        const userdb = await User.findOne({ email: email });

        // If user does not exist, create it.
        if (userdb) {
            res.send("User already exits");
        } else {
            const newUser = {
                username: username,
                email: email,
                roleId: roleId,
                password: password
            }
            await User.create(newUser);
            res.send(`User ${JSON.stringify(newUser)} was added. Role: USER`);
        }
    },

    // Create user with role ADMIN.
    createUserAdmin: async (req, res) => {
        const username = req.body.newUserName;
        const email = req.body.newUserEmail;
        const roleId = process.env.ADMIN_ROLE_ID;
        const password = Bcryp.hashSync(req.body.newUserPassword, 4);

        // Search if user already exists in db.
        const userdb = await User.findOne({ email: email });

        // If user does not exist, create it.
        if (userdb) {
            res.send("User already exits");
        } else {
            const newUser = {
                username: username,
                email: email,
                roleId: roleId,
                password: password
            }

            await User.create(newUser);
            res.send(`User ${JSON.stringify(newUser)} was added. Role: ADMIN`);
        }
    },

    // Delete user by Id
    deleteUser: async (req, res) => {

        await User.findByIdAndDelete(req.params.id);
        res.send(`User with id ${JSON.stringify(req.params.id)} was deleted`)
    }
}