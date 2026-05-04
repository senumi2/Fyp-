import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def predict_all_parameters():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            return

        # Node එකෙන් ලැබෙන array of objects
        data_list = json.loads(input_data)
        
        if len(data_list) < 10:
            print(json.dumps({"error": "Need more data (at least 10 records) to predict"}))
            return

        parameters = ["temperature", "humidity", "windSpeed", "windDirection", "pressure", "cloudCover", "rainfall"]
        predictions = {}

        window_size = 5 # රටාව බැලීමට පහුගිය දත්ත 5ක් ගනී

        for param in parameters:
            values = [d[param] for d in data_list]
            
            X = []
            y = []
            for i in range(len(values) - window_size):
                X.append(values[i : i + window_size])
                y.append(values[i + window_size])

            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(np.array(X), np.array(y))

            last_window = np.array(values[-window_size:]).reshape(1, -1)
            pred = model.predict(last_window)
            predictions[param] = round(float(pred[0]), 2)

        print(json.dumps(predictions))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    predict_all_parameters()