import pandas as pd
from datetime import datetime
from meteostat import stations, daily
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Station ID (Hambantota: 43497)
station_id = '43497' 
start = datetime(2015, 1, 1)
end = datetime(2023, 12, 31)

print(f"Station {station_id} වෙතින් දත්ත ලබා ගනිමින් පවතී...")

try:
    data_request = daily(station_id, start, end)
    df = data_request.fetch()

    if df is None or df.empty:
        print("Error: දත්ත ලැබුණේ නැත!")
    else:
        print(f"සාර්ථකයි! මුල් දත්ත පේළි {len(df)} ක් ලැබුණා.")

        # දත්ත පිරිසිදු කිරීම (Preprocessing)
        # 1. tmin සහ tmax අනිවාර්යයෙන්ම තිබිය යුතු නිසා ඒවා නැති පේළි ඉවත් කරන්න
        df = df.dropna(subset=['tmin', 'tmax'])
        
        # 2. tavg (සාමාන්‍යය) ගණනය කිරීම
        df['tavg'] = (df['tmin'] + df['tmax']) / 2

        # 3. වර්ෂාපතනය (prcp) හිස් නම් එය 0 ලෙස සලකන්න (වැසි නැති බව)
        if 'prcp' in df.columns:
            df['prcp'] = df['prcp'].fillna(0)
        else:
            df['prcp'] = 0

        # 4. අනෙක් හිස් තැන් පිරවීම
        df = df.ffill().bfill()

        # 5. Target එක සෑදීම (හෙට උෂ්ණත්වය)
        df['target_temp'] = df['tavg'].shift(-1)
        df = df.dropna(subset=['target_temp']) # අවසාන පේළිය ඉවත් වේ

        print(f"පිරිසිදු කිරීමෙන් පසු දත්ත පේළි {len(df)} ක් ඉතිරි විය.")

        if len(df) > 0:
            # Features තෝරාගැනීම
            features_list = ['tavg', 'tmin', 'tmax', 'prcp']
            X = df[features_list]
            y = df['target_temp']

            # 3. Model Training
            print("ML මාදිලිය පුහුණු වෙමින් පවතී...")
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)

            # 4. Save Model
            joblib.dump(model, 'weather_model.pkl')
            print("--- සුභ පැතුම්! ---")
            print("'weather_model.pkl' සාර්ථකව නිර්මාණය විය.")
        else:
            print("Error: පිරිසිදු කිරීමෙන් පසු පුහුණු කිරීමට දත්ත ඉතිරි වී නැත.")

except Exception as e:
    print(f"දෝෂයක් සිදු විය: {e}")