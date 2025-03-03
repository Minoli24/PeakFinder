# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib

# # Load models
# classifier_model = joblib.load('random_forest_classifier.pkl')
# regressor_distance_model = joblib.load('random_forest_regressor_distance.pkl')
# regressor_time_model = joblib.load('random_forest_regressor_time.pkl')

# app = Flask(__name__)
# CORS(app)  # Enable CORS for React Native

# @app.route('/predict/classifier', methods=['POST'])
# def predict_classifier():
#     data = request.get_json()
#     features = data['features']  # Input features from the app
#     prediction = classifier_model.predict([features])
#     return jsonify({'prediction': prediction.tolist()})

# @app.route('/predict/regressor/distance', methods=['POST'])
# def predict_regressor_distance():
#     data = request.get_json()
#     features = data['features']
#     prediction = regressor_distance_model.predict([features])
#     return jsonify({'prediction': prediction.tolist()})

# @app.route('/predict/regressor/time', methods=['POST'])
# def predict_regressor_time():
#     data = request.get_json()
#     features = data['features']
#     prediction = regressor_time_model.predict([features])
#     return jsonify({'prediction': prediction.tolist()})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)

# ///////////////////////////////////////////////

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import numpy as np

# # Load models
# classifier_model = joblib.load('random_forest_classifier.pkl')
# regressor_distance_model = joblib.load('random_forest_regressor_distance.pkl')
# regressor_time_model = joblib.load('random_forest_regressor_time.pkl')

# app = Flask(__name__)

# # Allow all origins for debugging (restrict in production)
# # CORS(app, resources={r"/*": {"origins": ["http://localhost:19006", "http://192.168.1.12:5000"]}})
#  CORS(app, supports_credentials=True)


# ### ✅ 1. Trail Condition Classification
# @app.route('/predict/classifier', methods=['POST'])
# def predict_classifier():
#     try:
#         data = request.get_json()
#         print("Received Data:", data)  # Debugging

#         if not data or 'features' not in data:
#             return jsonify({'error': 'Invalid input'}), 400

#         features = np.array(data['features']).reshape(1, -1)
#         prediction = classifier_model.predict(features)

#         return jsonify({'prediction': prediction.tolist()})

#     except Exception as e:
#         print("Error:", str(e))
#         return jsonify({'error': str(e)}), 500


# ### ✅ 2. Predict Distance & Time for Hiking Trail
# @app.route('/predict/travel', methods=['POST'])
# def predict_travel():
#     try:
#         data = request.get_json()
#         print("Received Data:", data)  # Debugging

#         if not data or any(key not in data for key in ["elevation", "weather", "difficulty", "restStops"]):
#             return jsonify({'error': 'Missing required fields'}), 400

#        # Extract values from JSON
#         latitude = float(data["latitude"])
#         longitude = float(data["longitude"])
#         difficulty = int(data["difficulty"])
#         rest_stops = int(data["restStops"])
#         travel_mode = str(data["travelMode"])
#         weather_encoded = int(data["weatherEncoded"])
        
#         # Feature vector (only 4 features, matching the trained model)
#         input_features = np.array([[elevation, weather, difficulty, rest_stops]])

#         # Predictions
#         predicted_distance = regressor_distance_model.predict(input_features)[0]
#         predicted_time = regressor_time_model.predict(input_features)[0]

#         return jsonify({
#             "distance": round(predicted_distance, 2),
#             "time": round(predicted_time, 2)
#         })

#     except Exception as e:
#         print("Error:", str(e))
#         return jsonify({'error': str(e)}), 500

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# Load models
classifier_model = joblib.load('random_forest_classifier.pkl')
regressor_distance_model = joblib.load('random_forest_regressor_distance.pkl')
regressor_time_model = joblib.load('random_forest_regressor_time.pkl')

app = Flask(__name__)

# ✅ Fix: Allow CORS for all requests (Frontend can access the API)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for testing

### ✅ 1. Trail Condition Classification
@app.route('/predict/classifier', methods=['POST'])
def predict_classifier():
    try:
        data = request.get_json()
        print("Received Data:", data)  # Debugging

        if not data or 'features' not in data:
            return jsonify({'error': 'Invalid input'}), 400

        features = np.array(data['features']).reshape(1, -1)
        prediction = classifier_model.predict(features)

        return jsonify({'prediction': prediction.tolist()})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500


### ✅ 2. Predict Distance & Time for Hiking Trail
@app.route('/predict/travel', methods=['POST'])
def predict_travel():
    try:
        data = request.get_json()
        print("Received Data:", data)  # Debugging

        # Check if all required keys are in the request
        required_keys = ["elevation", "weatherEncoded", "difficulty", "restStops"]
        if not all(key in data for key in required_keys):
            return jsonify({'error': 'Missing required fields'}), 400

        # Extract values
        elevation = float(data["elevation"])
        weather_encoded = int(data["weatherEncoded"])
        difficulty_encoded = int(data["difficulty"])
        rest_stops = int(data["restStops"])

        # Prepare the feature vector in the correct order
        input_features = np.array([[elevation, weather_encoded, difficulty_encoded, rest_stops]])

        # Make predictions
        predicted_distance = regressor_distance_model.predict(input_features)[0]
        predicted_time = regressor_time_model.predict(input_features)[0]

        return jsonify({
            "distance": round(predicted_distance, 2),
            "time": round(predicted_time, 2)
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
