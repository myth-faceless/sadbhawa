import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, userName, phoneNumber, email, password, role } = req.body;
  //   console.log("email", email)
  if (
    [fullName, userName, phoneNumber, email, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required !");
  } else {
  }
});

export { registerAdmin };
