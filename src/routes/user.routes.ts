import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
const router = Router();

import User, { IUser } from '../models/user.model';
import Profile, { IProfile } from '../models/profile.model';

router.route('/').get(auth, async (req: Request, res: Response) => {
  const profiles = await Profile.find();
  const users = await User.find({ isVerified: true }).select([
    '-password',
    '-isVerified',
    '-updatedAt',
    '-email',
    '-__v'
  ]);
  return res.status(200).json({ users, profiles });
});

router.route('/:id').put(auth, async (req: Request, res: Response) => {
  Profile.updateOne(
    { userId: req.params.id },
    req.body,
    { upsert: false },
    async (err, updatedProfile) => {
      res.status(200).json(updatedProfile);
    }
  );
});

export default router;
