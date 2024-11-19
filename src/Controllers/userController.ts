import { IUser } from "../Models/user";
import User from "../Models/user";
import jwt from "jsonwebtoken"
import { LoginUserSchema, RegisterUserSchema } from "../Schemas/authSchema";

export const registerUser = async (user: Partial<IUser>) => {
  const { firstname, lastname, email, password } = user;

  const result = RegisterUserSchema.safeParse(user);
  if (!result.success) {
    return {
      field_errors: result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    };
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      error: "User with that email already exists.",
    };
  }

  const newUser = new User({ firstname, lastname, email, password });
  await newUser.save();

 
  return {
    user: newUser,
   
  };
};

export const loginUser = async (user: Partial<IUser>) => {
  const { email, password } = user;

  const result = LoginUserSchema.safeParse(user);
  if (!result.success) {
    return {
      field_errors: result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    };
  }

  const existingUser = await User.findByCredentials(email as string, password as string);
  if (!existingUser) {
    return{
      error: "No account exists with the provided credentials"
    };
  }

   const accesstoken = jwt.sign({
    existingUser:{
      firstname: existingUser.firstname,
      email: existingUser.email,
      id: existingUser.id
    },
  },
  process.env.JWT_SECRET as string ,
  {expiresIn: "30000"}
 );
  
  const refreshtoken = jwt.sign({
    existingUser:{
      firstname: existingUser.firstname,
      email: existingUser.email,
      id: existingUser.id
    },
  },
  process.env.JWT_SECRET as string ,
  {expiresIn: "60000"}
  );

  return {
    user: existingUser,
    accesstoken,
    refreshtoken
    
  };
};
