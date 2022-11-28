import { Router, Request, Response } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import auth from '../middleware/auth';
const router = Router();

import Language, { ILanguage } from '../models/language.model';

router.route('/').get(auth, async (req: Request, res: Response) => {
  try {
    const languages = await Language.find();
    return res.json(languages);
  } catch (error) {
    console.error(getErrorMessage(error));
    res.status(500).send('Server Error');
  }
});

export default router;
