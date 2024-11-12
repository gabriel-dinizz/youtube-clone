import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const RAW_VIDEO_BUCKET = 'youtube-clone-raw-videos';
const PROCESSED_VIDEO_BUCKET = 'youtube-clone-processed-videos';

const LOCAL_RAW_VIDEO_PATH = './raw_videos';
const LOCAL_PROCESSED_VIDEO_PATH = './processed_videos';

const paths = [LOCAL_RAW_VIDEO_PATH, LOCAL_PROCESSED_VIDEO_PATH];

// Utility function for logging
function log(message) {
    console.log(`[Video Processor]: ${message}`);
}

// Ensure directories exist
export function createLocalDirectories() {
    paths.forEach(ensureDirectoryExistence);
}

export function processVideo(rawVideoName, processedVideoName) {
    return new Promise((resolve, reject) => {
        const inputPath = `${LOCAL_RAW_VIDEO_PATH}/${rawVideoName}`;
        const outputPath = `${LOCAL_PROCESSED_VIDEO_PATH}/${processedVideoName}`;

        ffmpeg(inputPath)
            .outputOptions("vf", "scale=1:360") // 360p scaling
            .on("end", () => {
                log(`Processing finished for ${rawVideoName}`);
                resolve();
            })
            .on("error", (err) => {
                log(`Error processing video ${rawVideoName}: ${err.message}`);
                reject(err);
            })
            .save(outputPath);
    });
}

export async function downloadRawVideo(fileName) {
    try {
        await storage.bucket(RAW_VIDEO_BUCKET)
            .file(fileName)
            .download({
                destination: `${LOCAL_RAW_VIDEO_PATH}/${fileName}`,
            });
        log(`Downloaded ${fileName} to ${LOCAL_RAW_VIDEO_PATH}`);
    } catch (err) {
        log(`Error downloading ${fileName}: ${err.message}`);
        throw err;
    }
}

export async function uploadProcessedVideo(fileName) {
    const filePath = `${LOCAL_PROCESSED_VIDEO_PATH}/${fileName}`;
    const bucket = storage.bucket(PROCESSED_VIDEO_BUCKET);

    try {
        await bucket.upload(filePath);
        await bucket.file(fileName).makePublic();
        log(`Uploaded and made public: ${fileName} in ${PROCESSED_VIDEO_BUCKET}`);
    } catch (err) {
        log(`Error uploading ${fileName}: ${err.message}`);
        throw err;
    }
}

export function deleteRawVideo(fileName) {
    return deleteFile(`${LOCAL_RAW_VIDEO_PATH}/${fileName}`);
}

export function deleteProcessedVideo(fileName) {
    return deleteFile(`${LOCAL_PROCESSED_VIDEO_PATH}/${fileName}`);
}

function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    log(`Failed to delete file at ${filePath}: ${err.message}`);
                    reject(err);
                } else {
                    log(`Deleted file at ${filePath}`);
                    resolve();
                }
            });
        } else {
            log(`File not found at ${filePath}, skipping delete.`);
            resolve();
        }
    });
}

function ensureDirectoryExistence(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        log(`Created directory at ${path}`);
    }
}

