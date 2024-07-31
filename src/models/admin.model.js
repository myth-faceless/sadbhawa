import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            maxlength: 100
        },
        userName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/,
            maxlength: 15
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: /.+\@.+\..+/
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'superadmin']
        },
        avatar: {
            type: String,
        }

    }, { timestamps: true }
)

adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
}) 

adminSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password) 
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
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