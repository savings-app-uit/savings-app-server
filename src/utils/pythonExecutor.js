// tệp: pythonExecutor.js

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs"); // Thêm fs để đọc file
require('dotenv').config();

const PYTHON_PATH = process.env.PYTHON_PATH;
const MODEL_PATH = process.env.MODEL_PATH;
const SCRIPT_PATH = path.join(MODEL_PATH, "expense_classifier.py");

async function executePythonScript(imagePath) {
  return new Promise((resolve, reject) => {
    console.log(`Executing Python script ${SCRIPT_PATH} with image data from ${imagePath}`);
    
    // Không truyền imagePath như một đối số nữa
    const pythonProcess = spawn(PYTHON_PATH, [SCRIPT_PATH]);

    // Đọc dữ liệu ảnh vào buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Ghi buffer ảnh vào stdin của tiến trình Python
    pythonProcess.stdin.write(imageBuffer);
    pythonProcess.stdin.end(); // Báo hiệu đã gửi xong dữ liệu

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python stdout: ${data}`);
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("error", (err) => {
      console.error("Python process error:", err);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        const errorResult = {
          success: false,
          error: `Python script failed with code ${code}`,
        };
        resolve(errorResult);
      } else {
        try {
          console.log(`Python output: ${result}`);
          const jsonMatch = result.match(/\{.*\}/s);
          if (jsonMatch && jsonMatch[0]) {
            const parsedResult = JSON.parse(jsonMatch[0]);
            resolve(parsedResult);
          } else {
            throw new Error("No valid JSON found in Python output");
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          const errorResult = {
            success: false,
            error: `Failed to parse Python output: ${parseError.message}`,
          };
          resolve(errorResult);
        }
      }
    });
  });
}

module.exports = { executePythonScript };