import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
 import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false
        })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token !")
        
    }
}

const registerUser = asyncHandler( async (req, res) => {

   // get user details from frontend
  const { fullname, email, username, password } = req.body
//   console.log("email:", email)

// validation - not empty
 if(
    [fullname, email, username, password].some((field) => 
    field?.trim() === "" )
    ) {
        throw new ApiError(400, "All fields are required !")
    }
 // check if user already exists: username, email
   const existedUser =  await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exist !")
    }

    // check for images, avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required !")
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar is required !")
    }

    // create user object - create entry in db
   const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   // check for user creation
   if(!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user !")
   }

    // return response
   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully !")
   )

})

const loginUser = asyncHandler( async (req, res) => {
    //req body -> data
    const { email, username, password } = req.body

    // username or email
    if(!(username || email)) {
        throw new ApiError(400," Username or email is required !")
    }

    // find user in database
    const user = await User.findOne({
        $or: [{username}, {email}] // or use garera find anyone vanna khojeko 
    })

    if (!user) {
        throw new ApiError(404, "User does not exist !")
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials !")
    }

    // access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    // send cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User logged in Successfully !"
        )
    )
})

const logoutUser = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User Logged Out successfully !"))

})

const refreshAccessToken = asyncHandler ( async (req, res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request !")
   }

  try {
     const decodedToken = jwt.verify(
              incomingRefreshToken,
              process.env.REFRESH_TOKEN_SECRET,
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if(!user) {
          throw new ApiError(401, "Invalid Refresh Token !")
      }
  
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh Token is expired or used ! ")
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(
              200,
              {
                  accessToken, refreshToken: newRefreshToken
              },
              "Access token refreshed successfully !"
          )
      )
  } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token !")
  }
})

const changeUserPassword = asyncHandler ( async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password !")
   }

   user.password = newPassword
   await user.save({
    validateBeforeSave: false
   })

   return res.status(200)
   .json(new ApiResponse(200, {}, "Password Changed Successfully !"))
})

const getCurrentUser = asyncHandler( async (req, res) => {
    return res.status(200)
    .json(200, req.user, "Current User fetched successfully !")
})

const updateAccountDetails = asyncHandler( async (req, res) => {
    const {fullname, email} = req.body

    if(!fullname || !email) {
        throw new ApiError(400, "All fields are required !")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set: {
                fullname,
                email: email
            }
        }, 
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully !")
    )
})

const updateUserAvatar = asyncHandler( async (req, res) => {
   const avatarLocalPath =  req.file?.path

   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing !")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar !")
   }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set: {
            avatar: avatar.url
        }
    },
    {new: true}
   ).select("-password")

   return res.status(200)
   .json(new ApiResponse(200, user, "Avatar updated successfully !"))
})


export {
        registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken,
        changeUserPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar
}