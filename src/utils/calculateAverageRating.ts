export const calculateAverageRating = ratings => {
  if (!ratings || ratings.length === 0) {
    return 0; // If no ratings exist, return 0
  }

  // Sum all the ratings and ensure each rating is between 0 and 5
  const totalRatings = ratings.reduce((sum, ratingObj) => {
    const validRating = Math.min(Math.max(ratingObj.rating, 0), 5); // Clamp rating between 0 and 5
    return sum + validRating;
  }, 0);

  // Calculate the average
  const averageRating = totalRatings / ratings.length;

  // Return the average rounded to 2 decimal places
  return parseFloat(averageRating.toFixed(2));
};
