import { Router, Request, Response } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import auth from '../middleware/auth';
const router = Router();

import Soap, { ISoap } from '../models/soap.model';

router
  .route('/')
  .get(auth, async (req: Request, res: Response) => {
    const soaps = await Soap.find({ isPublic: true });
    return res.status(200).json({ soaps });
  })
  .post(auth, async (req: Request, res: Response) => {
    try {
      const {
        userId,
        title,
        verse,
        scripture,
        observation,
        application,
        prayer,
        isPublic
      } = req.body;

      if (
        !userId ||
        !title ||
        !verse ||
        !scripture ||
        !observation ||
        !application ||
        !prayer
      ) {
        return res.status(400).json({ msg: 'Missing information' });
      }

      const soap = new Soap({
        userId,
        title,
        verse,
        scripture,
        observation,
        application,
        prayer,
        isPublic
      });

      await soap.save();
      res.status(200).json(soap);
    } catch (error) {
      console.error(getErrorMessage(error));
      res.status(500).send('Server Error');
    }
  });

router
  .route('/user/:userid/:soapid?')
  .get(auth, async (req: Request, res: Response) => {
    try {
      const userId: String = req.params.userid;
      const soapId: String = req.params.soapid || null;
      let searchParams: Object = {};

      if (!soapId) {
        searchParams = { userId };
      } else {
        searchParams = { _id: soapId, userId };
      }
      const soaps = await Soap.find(searchParams);
      return res.status(200).json({ soaps });
    } catch (error) {
      console.error(getErrorMessage(error));
      res.status(500).send('Server Error');
    }
  })
  .put(auth, async (req: Request, res: Response) => {
    try {
      Soap.updateOne(
        { _id: req.params.soapid, userId: req.params.userid },
        req.body,
        { upsert: false },
        async (err, updatedSoap) => {
          if (err) {
            console.error(getErrorMessage(err));
            return res.status(500).send('ServerError');
          }
          res.status(200).json(updatedSoap);
        }
      );
    } catch (error) {
      console.error(getErrorMessage(error));
      res.status(500).send('Server Error');
    }
  })
  .delete(auth, async (req: Request, res: Response) => {
    try {
      await Soap.deleteOne({
        _id: req.params.soapid,
        userId: req.params.userid
      });
      res.status(200).json({ msg: 'SOAP Deleted' });
    } catch (error) {
      console.error(getErrorMessage(error));
      res.status(500).send('Server Error');
    }
  });

export default router;
