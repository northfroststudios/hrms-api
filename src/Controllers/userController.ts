import { IUser } from "../Models/user"
import User from "../Models/user"

export const registerUser = async (user: Partial<IUser>) => {
  const { firstname,lastname, email, password } = user
  if (!firstname || !lastname || !email || !password) {
    return {
      error: 'Please provide all the required fields',
    }
  }
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return {
      error: 'User with that email already exists.',
    }
  }
  const newUser = new User({ firstname,lastname, email, password })
  await newUser.save()
  const token = await newUser.generateAuthToken()
  return {
    user: newUser,
    token,
  }
}

export const loginUser = async (user: Partial<IUser>) => {
  const { email, password } = user
  if (!email || !password) {
    return {
      error: 'Please provide all the required fields',
    }
  }
  const existingUser = await User.findByCredentials(email, password)
  if (!existingUser) {
    return null
  }
  const token = await existingUser.generateAuthToken()
  return {
    user: existingUser,
    token,
  }
}

