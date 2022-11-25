import { Schema, Types, model } from 'mongoose';

export interface IAuthToken {
  userId: Types.ObjectId;
  refreshToken: string;
  isActive: boolean;
}

const authTokenSchema = new Schema<IAuthToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default model<IAuthToken>('AuthToken', authTokenSchema);
