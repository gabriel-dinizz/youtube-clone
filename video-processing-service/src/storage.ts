import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = 'youtube-clone-raw-videos';
const processedVideoBucketName = 'youtube-clone-processed-videos';

const localFilePath = './video.mp4';
const localFilePathProcessed = './video_processed.mp4';
const localRawVideoPath = './raw_videos';

// Creates local directories for the raw and processed videos
export function createLocalDirectories() {
    ensureDirectoryExistence(localFilePath);
    ensureDirectoryExistence(localFilePathProcessed);
}

export function detVideo(rawVideoName, processedVideoName) {
    return new Promise((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("vf", "scale=1:360") // 360p
            .on("end", function () {
                console.log("Processing finished!");
                resolve();
            })
            .on("error", function (err) {
                console.log("Error: ", err);
                reject(err);
            })
            .save(`${localFilePathProcessed}/${processedVideoName}`);
    });
}

export async function downloadRawVideo(fileName) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({
            destination: `${localRawVideoPath}/${fileName}`,
        });

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}

export async function uploadProcessedVideo(fileName) {
    const bucket = storage.bucket(processedVideoBucketName);

    // Upload the video to bucket
    await bucket.upload(`${localFilePathProcessed}/${fileName}`);

    await bucket.file(fileName).makePublic(); // Make the video public
    console.log(`File uploaded to gs://${processedVideoBucketName}/${fileName}`);
}

export function deleteRawVideo(fileName) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName) {
    return deleteFile(`${localFilePathProcessed}/${fileName}`);
}

function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping delete.`);
            resolve();
        }
    });
}

function ensureDirectoryExistence(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true }); // recursive: true creates nested directories
        console.log(`Directory created at ${filePath}`);
    }
}
