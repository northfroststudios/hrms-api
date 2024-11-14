// userSchema.methods.generateAuthToken = async function () {
//     const user = this
//     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY as string)
//     user.tokens = user.tokens.concat({ token })
//     await user.save()
//     return token
//   }