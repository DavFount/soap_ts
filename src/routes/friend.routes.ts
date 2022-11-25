import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
const router = Router();

// import User, { IUser } from '../models/user.model';
import Profile, { IProfile } from '../models/profile.model';

router.route('/add').put(auth, async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;

  await Profile.updateOne(
    {
      userId
    },
    {
      $push: { friends: friendId }
    }
  );

  res.status(200).json({ msg: 'Friend Added Successfully' });
});

router.route('/remove').put(auth, async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;

  await Profile.updateOne(
    {
      userId
    },
    {
      $pull: { friends: friendId }
    }
  );

  res.status(200).json({ msg: 'Friend Removed Successfully' });
});

export default router;
