import prisma from './prisma';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
    console.log('Using .env.test');  // Debugging output
  } else {
    dotenv.config();
    console.log('Using .env');
  }

const config = {
    port: process.env.PORT || 8000,
    environment: process.env.NODE_ENV || 'development',
};


console.log('DATABASE_URL:', process.env.DATABASE_URL); // Debugging output

export {
    config,
    prisma
};