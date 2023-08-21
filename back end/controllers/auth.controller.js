/** call library jwt */
const jwt = require(`jsonwebtoken`)

/** call md5 library */
const md5 = require(`md5`)

/** load model of user */
const userModel = require(`../models/index`).user

async function verifyToken(token) {
    try {
        let secretKey = 'sixnature joss'
        let decode = jwt.verify(token, secretKey)
        return true
    } catch (error) {
        return false
    }
}

exports.authentication = async (request, response) => {
    try {
        /** grab username and password */
        let params = {
            username: request.body.username,
            password: md5(request.body.password)
        }

        /** check user exist */
        let result = await userModel.findOne(
            {
                where: params
            }
        )

        /** validate result */
        if (result) {
            /** if user has exist, generate token */
            /** define secret key of jwt */
            let secretKey = 'sixnature joss'
            /** define header of jwt */
            let header = {
                algorithm: "HS256"
            }

            /** define payload */
            let payload = JSON.stringify(result)

            /** do generate token using jwt */
            let token = jwt.sign(payload, secretKey, header)

            /** give response */
            return response.json({
                status: true,
                token: token,
                message: 'Login berhasil',
                data: result
            })
        } else {
            /** if user doesn't exist */
            /** give a response */
            return response.json({
                status: false,
                message: 'Invalid username or password'
            })
        }
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.authorization = (roles) => {
    return async function (request, response, next) {
        try {
            /** grab data header */
            let headers = request.headers.authorization

            /** grab data token */
            /** exp : Bearer udhghrughruhgrhg */
            let token = headers?.split(" ")[1]
            /** ? -> digunakan untuk antisipasi jika variabel
             * tsb bernilai null atau undefined
             * spit => memecah string menjadi array
             */

            if (token == null) {
                return response
                    .status(401)
                    .json({
                        status: true,
                        message: `Unauthorized`
                    })
            }
            // console.log(token);

            /** verify token */
            if (! await verifyToken(token)) {
                return response
                    .status(401)
                    .json({
                        status: false,
                        message: `INVALID TOKEN`
                    })
            }

            /** decrypt token to plain text */
            let plainText = jwt.decode(token)

            /** check allowed roles */
            if (!roles.includes(plainText?.role)) {
                return response
                    .status(401)
                    .json({
                        status: false,
                        message: `FORBIDDEN ACCESS`
                    })
            }

            next()

        } catch (error) {
            return response.json({
                status: false,
                message: error.message
            })
        }
    }
}