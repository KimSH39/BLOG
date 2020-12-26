import Joi from 'joi';
import Admin from '../../model/admin';

export const register = async (ctx) => {
  const schema = Joi.object.keys({
    name: Joi.string().min(2).max(10).required(),
    email: Joi.string.email().required(),
    password: Joi.string().min(8).required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { name, email, password } = ctx.request.body;

  try {
    const nameExist = await Admin.findOne({ name });
    const emailExist = await Admin.findOne({ email });

    if (emailExist || nameExist) {
      ctx.status = 409;
      return;
    }

    const admin = new Admin({ name, email });

    await admin.setPassword(password);
    await admin.save();

    ctx.body = admin.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*export const login = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string.email().required(),
    password: Joi.string().min(8).required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password } = ctx.request.body;

  try {
    const admin = await Admin.findOne(email);
    const valid = await Admin.checkPassword(password);

    if (!admin || !valid) {
      ctx.status = 401;
      return;
    }

    ctx.body = admin.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};*/

export const check = async (ctx) => {
  const { user } = ctx.state;

  if (!user) {
    ctx.status = 401;
    return;
  }

  ctx.body = user;
};

export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204; // No Content
};
