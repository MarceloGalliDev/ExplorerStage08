const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
class UsersControlers {
    async create(req, res){
        const {name, email, password} = request.body;

        const database = await sqliteConnection()
    }
}