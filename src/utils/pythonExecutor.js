const { spawn } = require("child_process");
const path = require("path");

const PYTHON_PATH = "D:\\New folder\\SE\\PPLT\\FinalProject1\\savings-app-model\\venv\\Scripts\\python.exe";
const MODEL_PATH = "D:\\New folder\\SE\\PPLT\\FinalProject1\\savings-app-model";
const SCRIPT_PATH = path.join(MODEL_PATH, "expense_classifier.py");

async function executePythonScript(imagePath) {
  return new Promise((resolve, reject) => {
    console.log(`Executing Python script: ${SCRIPT_PATH} with image ${imagePath}`);
    const pythonProcess = spawn(PYTHON_PATH, [SCRIPT_PATH, imagePath]);

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