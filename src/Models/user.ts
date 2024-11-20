import { Schema,model,Document,Model,HydratedDocument} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose';


export interface IUser extends Document {
    _id: Types.ObjectId;
    firstname: string
    lastname: string
    email: string
    password: string
    authToken?: string
    authTokenExpires?: Date
    isActive: Boolean
  }

  
  export interface IUserMethods {
   
    toJSON(): IUser
  }
  
  interface UserModel extends Model<IUser, {}, IUserMethods> {
    findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>
  }

  const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    authToken: { type: String },
    authTokenExpires: { type: Date },
    isActive: {
      type: Boolean,
      default: false
    },
    
  })
  
  userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8)
    }
    next()
  })
  


  userSchema.methods.toJSON = function () {
    const user = this as IUser
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
  }
  
  userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
      return null
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return null
    }
    return user
  }
  
  const User = model<IUser, UserModel>('User', userSchema)
  
  export default User
