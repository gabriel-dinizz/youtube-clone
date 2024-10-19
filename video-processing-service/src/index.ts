import express from 'express';
import { 
  uploadProcessedVideo,
  downloadRawVideo,
  deleteRawVideo,
  deleteProcessedVideo,
  convertVideo,
  setupDirectories
} from './storage';

// Create the local directories for videos
setupDirectories();

const app = express();
app.use(express.json());

// Define the structure of the process video request
interface ProcessVideoRequest {
  inputFilePath: string;
  outputFilePath: string;
}

// Route to handle video processing
app.post("/process-video", async (req, res) => {
  const { inputFilePath, outputFilePath } = req.body as ProcessVideoRequest;

  if (!inputFilePath || !outputFilePath) {
    return res.status(400).send("Bad Request: Missing file paths");
  }

  try {
    // Download the raw video
    await downloadRawVideo(inputFilePath);

    // Process the video
    await convertVideo(inputFilePath, outputFilePath);

    // Upload the processed video
    await uploadProcessedVideo(outputFilePath);

    // Clean up local files
    await Promise.all([
      deleteRawVideo(inputFilePath),
      deleteProcessedVideo(outputFilePath),
    ]);

    return res.status(200).send("Processing finished successfully");

  } catch (err: any) {
    console.error("Error during video processing:", err.message);

    // Attempt to clean up in case of failure
    await Promise.all([
      deleteRawVideo(inputFilePath),
      deleteProcessedVideo(outputFilePath),
    ]);

    return res.status(500).send("An error occurred during processing: " + err.message);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
