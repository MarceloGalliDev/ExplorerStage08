const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
class UsersControlers {
    async create(req, res){
        const {name, email, password} = request.body;

        const database = await sqliteConnection()

        const checkUserExists = await database.get("SELECT * FROM users WHERE = email(?)", [email])

        if(checkUserExists){
            throw new AppError("User already exists!")
        }

        const hashedPassword = await hash(password, 10)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])

        return response.status(201).json();
    }
}

module.exports = UsersControlers;