// gsc files interaction //  track local file interactions

import { Storage } from '@google-cloud/storage';
import fs, { lchown } from 'fs';
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

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("vf", "scale=1:360") // 360p
        .on("end", function () {
            console.log("Processing finished !");
            resolve();
        })
        .on("error", function (err) {
            console.log("Error: ", err);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
      .file(fileName)
      .download({
        destination: `${localRawVideoPath}/${fileName}`,
      });
  
    console.log(
      `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
  }
  
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    //Upload the video to bucket

    await storage.bucket(processedVideoBucketName)
    .upload(`${localProcessedVideoPath}/${fileName} upload to gs ${processedVideoBucketName}/${fileName}`);

    await bucket.file(fileName).makePublic(); // make the video public
  }


export function deleteRawVideo(fileName: string){
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName: string){
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);  
}

function deleteFile(filePath: string): Promise<void> {
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
