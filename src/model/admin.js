import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  hashedPassword: { type: String, required: true },
});

AdminSchema.methods.setPassword = async function (password) {
  const hashed = await bcrypt.hash(password, 10);
  this.hashedPassword = hashed;
};

AdminSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

AdminSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

AdminSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      id: Admin._id,
      username: Admin.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

const Admin = model('Admin', AdminSchema);
export default Admin;
