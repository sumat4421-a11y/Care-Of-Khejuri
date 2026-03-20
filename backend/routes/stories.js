const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/Story');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Get all stories (public)
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ date: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single story (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create story with file upload (protected)
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    // Get uploaded file paths
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const story = new Story({
      title,
      description,
      images,
      location,
      date
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    // Clean up uploaded files if story creation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update story with file upload (protected)
router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }

    const { title, description, location, date, existingImages } = req.body;

    // Safely parse existing images
    let images = [];
    if (existingImages) {
      try {
        images = JSON.parse(existingImages);
        if (!Array.isArray(images)) images = [];
      } catch (parseErr) {
        images = [];
      }
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    // Get old story to clean up removed images
    const oldStory = await Story.findById(req.params.id);
    if (!oldStory) {
      // Clean up uploaded files if story not found
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      return res.status(404).json({ message: 'Story not found' });
    }

    // Delete old images that are no longer in the updated list
    if (oldStory.images && oldStory.images.length > 0) {
      const removedImages = oldStory.images.filter(img => !images.includes(img));
      removedImages.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, err => {
          if (err && err.code !== 'ENOENT') console.error('Error deleting old file:', err);
        });
      });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { title, description, images, location, date },
      { new: true, runValidators: true }
    );

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete story and associated images (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Delete associated image files
    if (story.images && story.images.length > 0) {
      story.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
