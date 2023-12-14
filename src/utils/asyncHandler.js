
//By using promise you can get request handled as: 

const asyncHandler = (requestHandler) => {
    return ( req, res, next ) => {
        Promise.resolve(requestHandler( req, res, next )).
        catch((err) => next(err))
    }

}




//if you are using try catch to handle the request

// const asyncHandler = (fn) => {
//     async ( req, res, next ) => {
//         try {
//             await ( req, res, next )
//         } catch (error) {
//             res.status(err.code || 500).json({
//                 success: false,
//                 message: err.message
//             })
            
//         }
//     }
// }


export { asyncHandler }