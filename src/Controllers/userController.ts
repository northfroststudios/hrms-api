import { IUser } from "../Models/user";
import User from "../Models/user";
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
  if (existingUser) {
    return{
      error: "User already exists"
    };
  }
  
  return {
    user: existingUser,
    
  };
};
