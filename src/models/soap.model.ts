import { Schema, Types, model } from 'mongoose';

export interface ISoap {
  userId: Types.ObjectId;
  title: string;
  verse: string;
  scripture: string;
  observation: string;
  application: string;
  prayer: string;
  isPublic: boolean;
}

const soapSchema = new Schema<ISoap>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Soap',
      required: true
    },
    title: {
      type: String,
      required: false
    },
    verse: {
      type: String,
      required: false
    },
    scripture: {
      type: String,
      required: false
    },
    observation: {
      type: String,
      required: false
    },
    application: {
      type: String,
      required: false
    },
    prayer: {
      type: String,
      required: false
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default model<ISoap>('Soap', soapSchema);
