import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-paper';

const RatingComponent = ({onRate, setRating, rating}) => {
  // Function to handle star selection
  const handleStarPress = index => {
    console.log('OnPee');
    setRating(index + 1); // Update the rating when a star is pressed
    if (onRate) {
      onRate(index + 1); // Optionally, call a callback if passed
    }
  };

  return (
    <View style={styles.ratingContainer}>
      {[0, 1, 2, 3, 4].map((_, index) => (
        <TouchableOpacity onPress={() => handleStarPress(index)}>
          <Icon
            key={index}
            source={index < rating ? 'star' : 'star-outline'} // Filled or outline star based on rating
            size={50}
            color="#FFC403"
            // Handle star click
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  star: {
    marginHorizontal: 5,
  },
});

export default RatingComponent;
