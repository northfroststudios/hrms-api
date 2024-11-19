import { IUser } from "../Models/user";
import User from "../Models/user";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { LoginUserSchema, RegisterUserSchema } from "../Schemas/authSchema";
import { sendMail } from '../Utils/mailer';

export const registerUser = async (user: Partial<IUser>) => {
  const { firstname, lastname, email, password } = user;

  // const token = crypto.randomBytes(20).toString('hex');
  // user.authToken = token;
  // user.authTokenExpires = new Date(Date.now() + 300000);



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

  const token = crypto.randomBytes(20).toString('hex');
  newUser.authToken = token;
  newUser.authTokenExpires = new Date(Date.now() + 300000);

  await newUser.save();
  
  console.log("User saved with token:", newUser.authToken);

  const verifyLink = `http://localhost:3000/api/user/verify/${token}`;
  await sendMail(email as string, 'Email Verification', `Please verify your account by clicking on this link ${verifyLink}`);


  return {
    user: newUser,
    message: "Registration successful! Please check your email for verification.",
    token
   
  };


};

export const verifyAccount = async (token: string): Promise<{ message: string } | { error: string }> => {

  try{
      const user = await User.findOne({ authToken: token, isActive: false, authTokenExpires: { $gt: new Date() } });
      
      console.log("Verifying account with token:", token);

      if (!token) {
        return { error: 'Auth token is required' };
      }
      

      if (!user) {
;
        return { error: 'Invalid or expired token' };
      }


      user.isActive = true;
      user.authToken = undefined; 
      user.authTokenExpires = undefined; 
      await user.save();

      

      return { message: 'Account verified' };
  } catch (error) {
      console.error('Error verifying account:', error);
      return { error: 'Internal Server Error' };
  }
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


