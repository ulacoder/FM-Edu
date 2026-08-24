import dotenv from 'dotenv';
dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  fmEduUrl: process.env.FM_EDU_URL || 'https://fm-edu.vercel.app',
  databaseUrl: process.env.DATABASE_URL || '',
  port: parseInt(process.env.PORT || '3000'),
};
