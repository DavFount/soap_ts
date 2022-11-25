import { Types } from 'mongoose';
import { Router, Request, Response } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import SHA256 from 'crypto-js/sha256';
import MD5 from 'crypto-js/md5';
import { MailDataRequired } from '@sendgrid/mail';
import { SendMail } from '../services/mailer';

import User, { IUser } from '../models/user.model';
import Activation, { IActivation } from '../models/activation.model';
import Profile, { IProfile } from '../models/profile.model';
import AuthToken, { IAuthToken } from '../models/authToken.model';

const router = Router();

router.route('/login').post(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Username/Password' });
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Username/Password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email address' });
    }

    const refreshToken = await generateRefreshToken(user._id);
    const accessToken = generateAccessToken({ id: user._id });
    const { _id, firstName, lastName, role } = user;
    res.status(200).json({
      _id,
      firstName,
      lastName,
      role,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

router.route('/register').post(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'E-Mail address already in use.' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const uuid = uuidv4();
    const verToken = SHA256(uuid);
    const activation = new Activation({
      verificationToken: verToken,
      userId: user._id
    });

    await activation.save();

    const url = `http://localhost:5173/verify?t=${verToken}`;
    const msg: MailDataRequired = {
      to: email,
      from: 'noreply@thesoapdish.app',
      subject: 'Welcome to the SOAP Dish',
      dynamicTemplateData: {
        c2a_link: url,
        c2a_button: 'Verify E-Mail'
      },
      templateId: 'd-593ccf0a20d74091a82931fe31689c3a'
    };
    SendMail(msg);

    res.status(200).json({ msg: 'User Created. Pending Activation.' });
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

router.route('/verify').post(async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    // Find the pending activation
    const activation = await Activation.findOne({ token });
    if (!activation) {
      return res.status(404).json({ msg: 'No activation pending!' });
    }

    // Locate the user
    const user = await User.findOne({
      _id: activation.userId
    });
    if (!user) {
      return res.status(404).json({ msg: 'No user found' });
    }

    // Activate the user
    const profile = new Profile({
      userId: user._id,
      avatarHash: MD5(user.email)
    });
    await profile.save();

    User.updateOne(
      { _id: activation.userId },
      { isVerified: true },
      { upsert: false },
      async function (error, updatedUser) {
        // Delete Activation once its done
        await Activation.deleteOne({ _id: activation._id });

        const refreshToken = await generateRefreshToken(user._id);
        const accessToken = generateAccessToken({ id: user._id });
        const { _id, firstName, lastName, role } = user;
        res.status(200).json({
          _id,
          firstName,
          lastName,
          role,
          accessToken,
          refreshToken
        });
      }
    );
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

router.route('/refresh').post(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const authToken = await AuthToken.findOne({ refreshToken });
    if (!authToken) {
      return res.status(401).json({ msg: 'Invalid Token' });
    }

    const user = await User.findOne({ _id: authToken.userId });

    if (user.isActive && authToken.isActive) {
      // Generate new Access Token
      const accessToken = generateAccessToken({ id: user._id });
      return res.status(200).json(accessToken);
    } else {
      res.status(403).send({ msg: 'Account Disabled' });
    }
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

router.route('/logout').post(async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    await AuthToken.deleteOne({ userId: id });
    return res.status(200).json({ msg: 'Logout successful' });
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

function generateAccessToken(payload: Object) {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '60m'
  });
}

async function generateRefreshToken(id: Types.ObjectId) {
  const refreshTokenObject = await AuthToken.findOne({ userId: id });
  if (!refreshTokenObject) {
    const uuid = uuidv4();
    const refreshToken = SHA256(uuid);
    const authToken = new AuthToken({
      userId: id,
      refreshToken
    });
    authToken.save();
    return refreshToken;
  }
  return refreshTokenObject.refreshToken;
}

export default router;
