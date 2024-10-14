// gsc files interaction //  track local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName =  'youtube-clone-raw-videos';
const processedVideoBucketName = 'youtube-clone-processed-videos';

const localFilePath = 'video.mp4';
const localFilePathProcessed = 'video_processed.mp4';

// Creates local directories for the raw and processed videos

export function createLocalDirectories() {
    ensureDirectoryExistence(localFilePath);
    ensureDirectoryExistence(localFilePathProcessed);
}
