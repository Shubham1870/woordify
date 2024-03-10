const mongoose = require("mongoose");
const readXlsxFile = require("read-excel-file/node");
const WordCategory = require("./model/model");
const path = require("path");  
require('dotenv').config();

// Connect to MongoDB
mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0.bj3vd.mongodb.net/LaundryApplication?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  mongoose.disconnect(); // Disconnect if there's an error
});

db.once("open", () => {
  console.log("Connected to MongoDB");
  uploadToMongoDB();
});

const uploadToMongoDB = () => {


  const filePath = path.join(__dirname, "excel", "file.xlsx");
  // Use forward slashes (/) in the path and ensure correct path to the Excel file

  readXlsxFile(filePath).then((rows) => {
    const headers = rows[0];
    rows.shift(); // Remove header row

    const wordCategories = rows.map((row) => {
      const wordCategory = {
        name: row[0],
        image: row[1],
        totalWords: parseInt(row[2]),
        likes: 0,
        isPremium: false,
        tags: [],
        isCompleted: false,
        categoryType: "General",
        wordsList: [
          {
            word: row[3],
            meaning: row[4],
            image: row[5],
            use_case: row[6],
            isKnown: "unknown",
          },
          // Add more words as needed
        ],
      };
      return wordCategory;
    });

    WordCategory.insertMany(wordCategories)
      .then(() => {
        console.log("Data uploaded to MongoDB successfully");
        mongoose.disconnect();
      })
      .catch((error) => {
        console.error("Error uploading data to MongoDB:", error);
        mongoose.disconnect();
      });
  });
};
