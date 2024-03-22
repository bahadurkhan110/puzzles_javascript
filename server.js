const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  if (req.url === "/index.html" || req.url === "/") {
    // Serve index.html
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.url.startsWith("/getPuzzle")) {
    // Handle puzzle requests
    const puzzleName = querystring.parse(req.url.split("?")[1]).name; // Extract puzzle name from URL
    const puzzlePath = path.join(__dirname, "puzzles", `${puzzleName}.txt`);
    fs.readFile(puzzlePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Puzzle not found");
        return;
      }
      // Send puzzle data as JSON
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ puzzleText: data.toString() }));
    });
  } else if (req.url.startsWith("/puzzles/")) {
    // Block requests for puzzle files directly
    res.writeHead(403);
    res.end("Forbidden: Direct access not allowed");
  } else {
    // Handle other requests (e.g., CSS, images)
    const filePath = path.join(__dirname, req.url);

    // Check if the requested file is within the puzzles directory
    if (filePath.includes(path.join(__dirname, "puzzles"))) {
      res.writeHead(403);
      res.end("Forbidden: Direct access not allowed");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("File not found");
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
