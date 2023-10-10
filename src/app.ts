import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {COOKIES_SECRET, DB_URL, SERVER_PORT} from "./configs";
import router from './routes';

import {errorsHandler} from "./middlewares";
import {clientDetailsMiddleware} from "./middlewares";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIES_SECRET));
app.use(cors());

app.use(clientDetailsMiddleware);
app.use(router);

app.use(errorsHandler);

const server = async () => {
  try {
    await mongoose.connect(DB_URL);

    app.listen(SERVER_PORT, () => {
      console.log(`App listening on port ${SERVER_PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

server()
  .catch((e) => console.error(e));