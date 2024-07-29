import mongoose from "mongoose";
import jwt from "jwt";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100
        },
        phoneNumber: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/,
            maxlength: 15
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/
        },
        password: {
            type: String,
            required: true
        },
        img: {
            type: String
        }
    }, { timestamps: true}
)

adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Admin = mongoose.model("Admin", adminSchema)