

module.exports = async function(req, res, next) {
  try {
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: 'Missing listingId in request body' });
    }
    console.log('listingId is:', listingId);
    // Erstelle die Konversation über den Service
  } catch (error) {
    next(error);
  }
};
