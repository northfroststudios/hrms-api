import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../Models/user'

export interface CustomRequest extends Request {
  user?: IUser
}

interface DecodedToken {
  _id: string
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
     res.status(401).json({message: "Authentication failed"})
     return;
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as DecodedToken
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    })

    if (!user) {
      res.status(401).json({message: "Authentication failed"})
      return;
    }

    req.user = user
    
    next()
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' })
  }
}

export default auth
