declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      SECRET_KEY: string;
      DB_URI: string;
      SENDGRID_API_KEY: string;
      API_BIBLE_KEY: string;
      API_BIBLE_URL: string;
    }
  }
}

export {};
