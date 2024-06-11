import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base that will only allow routes if valid token is given
//next is used as a middleware
// If the user is authenticated, the function calls next() to pass control to the next middleware function or the request handler
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
          req.user = decode;
          next();
    } catch (error) {
        console.log(error);        
    }
}

//admin acceess
export const isAdmin = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user._id);
      if (user.role !== 1) {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
      });
    }
  };