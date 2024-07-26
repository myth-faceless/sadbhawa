import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    institution: {
        type: String,
        required: true
    }
}, { _id: false });

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        nmcNumber: {
            type: String,
            required: true
        },
        specialization: {
            type: String, 
            required: true
        },
        description: {
            type: String,
            required: true
        },
        qualification: {
            type: [qualificationSchema],
            required: true,
        },
        availableDays: {
            type: [String], 
            required: true,  
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
        },          
        dateOfBirth: {
            type: Date,
            required: true
        },
        contact: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profileImage: {
            type: String,
        },
    }, { timestamps: true },
)

export const Doctor = mongoose.model("Doctor", doctorSchema);