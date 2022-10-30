require("express-async-errors");

const AppError = require("../utils/AppError")
const express = require("express");

const app = express();

app.use(express.json());
app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }
    console.log(error);

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    })
})

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`))

