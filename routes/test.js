// Add this route to the existing test.js file

router.get('/:testId/results', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate('course', 'title');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Failed to fetch test results' });
  }
});