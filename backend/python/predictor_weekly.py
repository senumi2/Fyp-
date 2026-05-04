import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def predict_weekly():
    try:
        input_data = sys.stdin.read()
        if not input_data: return
        data_list = json.loads(input_data)
        
        parameters = ["temperature", "humidity", "windSpeed", "windDirection", "pressure", "cloudCover", "rainfall"]
        weekly_predictions = {}
        window_size = 10 

        for param in parameters:
            values = [d[param] for d in data_list]
            
            # Model එක පුහුණු කිරීම
            X, y = [], []
            for i in range(len(values) - window_size):
                X.append(values[i : i + window_size])
                y.append(values[i + window_size])

            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(np.array(X), np.array(y))

            # ඉදිරි දින 7 සඳහා අගයන් පුරෝකථනය කිරීම (Recursive Prediction)
            current_batch = list(values[-window_size:])
            future_forecasts = []
            
            for _ in range(7):
                pred = model.predict(np.array(current_batch).reshape(1, -1))[0]
                future_forecasts.append(pred)
                current_batch.pop(0)
                current_batch.append(pred)

            # සතියේ සාමාන්‍ය අගය (Average) ලබා ගැනීම
            weekly_predictions[param] = round(float(np.mean(future_forecasts)), 2)

        print(json.dumps(weekly_predictions))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    predict_weekly()