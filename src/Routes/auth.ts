import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, Router } from "express";
import User from '../Models/user';
import { sendMail } from '../Utils/mailer';
import jwt from 'jsonwebtoken';
const router = Router();

interface ForgotPasswordRequest {
    email:string;
}

interface ResetPasswordRequest {
  password:string;
  email: string;
  // token: string
}

interface ResetParams {
  token: string;
}

router.post('/forgot-password', async (req: Request<{},{},ForgotPasswordRequest>, res: Response): Promise<any> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 300000); //5 minutes
    await user.save();

    const resetURL = `http://localhost:3000/api/auth/reset-password/${token}`;

    await sendMail(email, 'Password Reset', `You requested a password reset. Click the link to reset your password: ${resetURL}. It expires on ${user.resetPasswordExpires}`);

    res.status(200).send('Password reset email sent');
  } catch (error) {
    res.status(500).send('Server error');
    console.log(error)
  }
});

router.post('/reset-password/:token', async (req: Request<ResetParams,{},ResetPasswordRequest>,res: Response, next): Promise<any> =>{
  const {token} = req.params;
  const {email,password} = req.body;

  try{
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    if(!user){
      return res.status(400).json({message:"Invalid or expired password reset token"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  }catch(error){
    console.log(error);
    res.status(500).json({message:'Something went wrong'});
  }

});

export default router;