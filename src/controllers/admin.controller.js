import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";

const registerAdmin = asyncHandler( async (req, res) => {
  // get required details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for avatar
  // upload avatar to cloudinary
  // create admin object - create entry in db
  // remove password and refresh token field from response
  // check for user creation 
  // return response


  const {fullName, userName, phoneNumber, email, password, role,} = req.body
//   console.log("email", email)
 if (
    [fullName, userName, phoneNumber, email, password, role].some((field) => 
    field?.trim() === "")
 ) {
    throw new ApiError(400, "All fields are required !")
 } else {
    
 }
})


export { registerAdmin }