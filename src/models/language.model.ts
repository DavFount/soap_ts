import { Schema, Types, model } from 'mongoose';

export interface ILanguage {
  code: string;
  name_en: string;
}

const languageSchema = new Schema<ILanguage>({
  code: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: true
  }
});

export default model<ILanguage>('Language', languageSchema);
