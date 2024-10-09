import express, { Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

interface ProcessVideoRequest {
  inputFilePath: string;
  outputFilePath: string;
}

interface ProcessVideoRequest {
  inputFilePath: string;
  outputFilePath: string;
}

// Route to handle video processing
app.post("/process-video", (req: any, res: any) => {
  const { inputFilePath, outputFilePath } = req.body as ProcessVideoRequest;

  if (!inputFilePath || !outputFilePath) {
    return res.status(400).send("Bad Request: Missing file path");
  }

  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      res.status(200).send("Processing finished successfully");
    })
    .on("error", (err: any) => {
      res.status(500).send("An error occurred: " + err.message);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
