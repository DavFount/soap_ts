import { Schema, Types, model } from 'mongoose';

export interface IActivation {
  userId: Types.ObjectId;
  verificationToken: string;
}

const activationSchema = new Schema<IActivation>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  verificationToken: {
    type: String,
    required: true
  }
});

export default model<IActivation>('Activation', activationSchema);
