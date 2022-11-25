import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
const router = Router();

import Language, { ILanguage } from '../models/language.model';

router.route('/').get(auth, async (req: Request, res: Response) => {
  const languages = await Language.find();
  return res.json(languages);
});

export default router;
