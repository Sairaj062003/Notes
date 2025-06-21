require('dotenv').config();
const config = require("./config.json");
const mongoose = require('mongoose');
mongoose.connect(config.connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require('./models/user.model');
const Notes = require('./models/note.model');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

// Error handling for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    next();
  });

// In your backend index.js
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Routes
app.get("/", (req, res) => {
    res.json({ data: 'hello' });
});

// Create Account
app.post("/create-account", async (req, res) => {
    try {
        console.log("Body received:", req.body);

        const { fullName, email, password } = req.body;

        if (!fullName) {
            return res.status(400).json({ error: true, message: "Full Name is required" });
        }
        if (!email) {
            return res.status(400).json({ error: true, message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ error: true, message: "Password is required" });
        }

        const isUser = await User.findOne({ email: email });

        if (isUser) {
            return res.json({
                error: true,
                message: 'User already exists',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await user.save();

        const accessToken = jwt.sign(
            { userId: user._id },  // Change this to match what your authenticateToken expects
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "36000m" }
          );

        return res.json({
            error: false,
            user,
            accessToken,
            message: "Registration Successful",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});
 //Login 
 app.post("/login", async (req, res) => {
    try {
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ 
                error: true, 
                message: "Email is required",
                received: req.body 
            });
        }
        
        if (!password || !password.trim()) {
            return res.status(400).json({ 
                error: true, 
                message: "Password is required",
                received: req.body
            });
        }

        const userInfo = await User.findOne({ email: email });
        if (!userInfo) {
            return res.json({ error: true, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, userInfo.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: true, message: "Invalid Credentials" });
        }

        const accessToken = jwt.sign(
            { 
                userId: userInfo._id,
                user: {  // Include minimal user data if needed
                    _id: userInfo._id,
                    fullName: userInfo.fullName,
                    email: userInfo.email
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '36000m' }
        );

        return res.json({
            error: false,
            user: userInfo,
            accessToken,
            message: "Login Successful",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const userInfo = await User.findById(req.user.userId).select('-password -__v');
        
        if (!userInfo) {
            return res.status(404).json({ 
                error: true, 
                message: 'User not found'
            });
        }
        
        return res.json({
            error: false,
            user: userInfo,
            message: "User found",
        });
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Internal Server Error"
        });
    }
});
//Add Notes
app.post("/add-note", authenticateToken, async (req, res) => {
    try {
        console.log("Authenticated User:", req.user); // Debug
        
        const { title, content, tags } = req.body;
        const userId = req.user.userId; // Or req.user._id depending on your token structure

        if (!title) return res.status(400).json({ error: true, message: "Title is required" });
        if (!content) return res.status(400).json({ error: true, message: "Content is required" });

        const note = new Notes({
            title,
            content,
            tags: tags || [],
            userId: userId // Use the userId from token
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});
//Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { title, content, tags, isPinned } = req.body;
        const userId = req.user.userId; // Changed from {user} to userId

        if (!title && !content && !tags && typeof isPinned !== 'boolean') {
            return res.status(400).json({ 
                error: true, 
                message: "No changes provided" 
            });
        }

        const note = await Notes.findOne({ _id: noteId, userId: userId });
        
        if (!note) {
            return res.status(404).json({ 
                error: true, 
                message: "Note not found" 
            });
        }

        // Update only provided fields
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (typeof isPinned === 'boolean') note.isPinned = isPinned;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error("Edit note error:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Internal Server Error",
            details: error.message 
        });
    }
});

//Get All Notes 

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Changed from {user} to userId
        
        // Use find() instead of findOne() to get all matching documents
        // Sort by isPinned (pinned notes first) and then by creation date (newest first)
        const notes = await Notes.find({ userId: userId })
                              .sort({ isPinned: -1, createdOn: -1 });
        
        return res.json({
            error: false,
            notes,  // This will now be an array of notes
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        console.error("Error getting notes:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Internal Server Error",
            details: error.message 
        });
    }
});
//Delete Notes 
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.user.userId; // This is correct

        // First check if note exists and belongs to user
        const note = await Notes.findOne({ _id: noteId, userId: userId });
        
        if (!note) {
            return res.status(404).json({ 
                error: true, 
                message: "Note not found" 
            });
        }

        // Delete the note
        await Notes.deleteOne({ _id: noteId, userId: userId });

        return res.json({
            error: false,
            message: "Note deleted successfully",
            deletedNote: note // Optional: return the deleted note details
        });

    } catch (error) {
        console.error("Delete note error:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Internal Server Error",
            details: error.message 
        });
    }
});

//Update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    try {
        // Verify MongoDB connection first
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not ready');
        }

        const noteId = req.params.noteId;
        const { isPinned } = req.body;
        const userId = req.user.userId;

        // Add timeout to the query
        const note = await Notes.findOne({ _id: noteId, userId: userId })
                              .maxTimeMS(30000) // 30 seconds timeout
                              .exec();

        if (!note) {
            return res.status(404).json({ 
                error: true, 
                message: "Note not found" 
            });
        }

        // Update pinned status
        note.isPinned = typeof isPinned === 'boolean' ? isPinned : false;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Pinned status updated successfully",
        });
    } catch (error) {
        console.error("Update pinned error:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Internal Server Error",
            details: error.message,
            dbStatus: mongoose.connection.readyState // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
        });
    }
});

//Search 
app.get("/search-notes", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { query } = req.query;
  
      if (!query) {
        return res.status(400).json({
          error: true,
          message: "Search query is required"
        });
      }
  
      const matchingNotes = await Notes.find({
        userId: userId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).sort({ isPinned: -1, createdOn: -1 });
  
      return res.json({
        error: false,
        notes: matchingNotes,
        message: "Search completed"
      });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ 
        error: true, 
        message: "Internal Server Error"
      });
    }
  });
app.listen(8000, () => {
    console.log("Server running on port 8000");
});

module.exports = app;