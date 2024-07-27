import mongoose from "mongoose";

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
        img: {
            type: String,
        }

    }, { timestamps: true }
)

export const Admin = mongoose.model("Admin", adminSchema)