// gsc files interaction //  track local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();