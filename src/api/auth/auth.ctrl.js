import Joi from 'joi';
import Admin from '../../model/admin';

/*
  // POST /api/auth/register
  {
    name: '김소현',
    email: 'sooooooohyeon5@naver.com'
    password: '123456'
  }
*/

export const register = async ctx => {
  const schema = Joi.object.keys({
    name: Joi.string().min(2).required(),
    email: Joi.string.email().required(),
    password: Joi.string().min(8).required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400; // Bad request
    ctx.body = result.error;
    return;
  }

  const { name, email, password } = ctx.request.body;

  try { 
    const emailExist = await Admin.findOne({ email });

    if (emailExist) {
      ctx.status = 409; // Conflict
      return;
    }
    const admin = new Admin({
      name,
      email,
      password,
    });

    await admin.setPassword(password);
    await admin.save();

    ctx.body = admin.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 로그인
// POST /api/auth/login

export const login = async ctx => {    
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
    const admin = await Admin.findOne({ email });
    const valid = await admin.checkPassword(password);

    if (!admin || !valid) {
      ctx.status = 401;
      return;
    }

    ctx.body = admin.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};