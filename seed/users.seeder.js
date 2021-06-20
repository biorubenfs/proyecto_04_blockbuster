import User from '../models/user.model.js';
import Role from '../models/role.model.js';

import connectDatabase from '../config/connection_db.js';
import dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config();

const urlDB = process.env.URL_DB;
const portDB = process.env.PORT_DB;
const nameDB = process.env.NAME_DB;

connectDatabase(urlDB, portDB, nameDB);

mongoose.connection.dropCollection('users', (err, result) => {
    console.log("*** users collection deleted ***");
})

const admin = await Role.findOne({ role: "admin" });
const user = await Role.findOne({ role: "user" });

const users = [
    new User({
        username: "rubenfs",
        email: "rubenfs@hotmail.com",
        password: "1234",
        roleId: admin.id
    }),
    new User({
        username: "alex",
        email: "alex@hotmail.com",
        password: "1234",
        roleId: user.id
    }),
];

let done = 0;
for (let i = 0; i < users.length; i++) {
    users[i].save((err, result) => {
        done++;
        if (done === users.length) {
            console.log("User seed has been planted!");
            exit();
        }
    });
}

const exit = () => {
    mongoose.disconnect();
}

// To run the seed $ node movies.seeder.js