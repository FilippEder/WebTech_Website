const { deleteConversation } = require('../../../services/conversations/delete.conversations.service');

module.exports = async function(req, res, next) {
  try {
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: 'Missing listingId in request body' });
    }
    const deleted = await deleteConversation(listingId);
    if (deleted) {
      return res.status(200).json({ success: true });
    }
    res.status(500).json({ error: 'Failed to delete conversation' });
  } catch (error) {
    next(error);
  }
};
