const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// Get all documents
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    
    // Format response to match frontend expectations
    const formattedDocs = docs.map(doc => ({
      id: doc._id.toString(),
      link: doc.link,
      title: doc.title || 'Untitled Document',
      processed: doc.processed,
      createdAt: doc.createdAt
    }));
    
    res.json(formattedDocs);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get single document by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({
      id: doc._id.toString(),
      link: doc.link,
      title: doc.title || 'Untitled Document',
      processed: doc.processed
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Create new document
router.post('/', async (req, res) => {
  try {
    const { link, title } = req.body;

    if (!link) {
      return res.status(400).json({ error: 'Document link is required' });
    }

    // Extract title from URL if not provided
    let docTitle = title;
    if (!docTitle) {
      try {
        const urlParts = new URL(link);
        const docId = urlParts.pathname.split('/').pop();
        docTitle = `Document ${docId.substring(0, 8)}`;
      } catch {
        docTitle = 'Untitled Document';
      }
    }

    const doc = new Document({
      link: link.trim(),
      title: docTitle.trim(),
      processed: false
    });

    await doc.save();

    res.status(201).json({
      id: doc._id.toString(),
      link: doc.link,
      title: doc.title,
      processed: doc.processed
    });
  } catch (error) {
    console.error('Error creating document:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Update document
router.put('/:id', async (req, res) => {
  try {
    const { link, title } = req.body;

    if (!link) {
      return res.status(400).json({ error: 'Document link is required' });
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    doc.link = link.trim();
    if (title) {
      doc.title = title.trim();
    }

    await doc.save();

    res.json({
      id: doc._id.toString(),
      link: doc.link,
      title: doc.title,
      processed: doc.processed
    });
  } catch (error) {
    console.error('Error updating document:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;

