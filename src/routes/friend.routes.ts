import { Router, Request, Response } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import auth from '../middleware/auth';
const router = Router();

// import User, { IUser } from '../models/user.model';
import Profile, { IProfile } from '../models/profile.model';

router.route('/add').put(auth, async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

router.route('/remove').put(auth, async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

export default router;
