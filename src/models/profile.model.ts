import { Schema, Types, model } from 'mongoose';

export interface IProfile {
  userId: Types.ObjectId;
  title: string;
  avatarHash: string;
  location: string;
  bio: string;
  language: Types.ObjectId;
  bible: string;
  website: string;
  twitter: string;
  instagram: string;
  facebook: string;
  organization: string;
  phone: string;
  mobile: string;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: false
    },
    avatarHash: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: false
    },
    bio: {
      type: String,
      required: false
    },
    language: {
      type: Schema.Types.ObjectId,
      ref: 'Language',
      required: false
    },
    bible: {
      type: String,
      required: false
    },
    website: {
      type: String,
      required: false
    },
    twitter: {
      type: String,
      required: false
    },
    instagram: {
      type: String,
      required: false
    },
    facebook: {
      type: String,
      required: false
    },
    organization: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    mobile: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

export default model<IProfile>('Profile', profileSchema);
