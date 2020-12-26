import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  hashedPassword: { type: String, required: true },
});

AdminSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.pw);
  return result;
};

AdminSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

const Admin = model('Admin', AdminSchema);
export default Admin;
