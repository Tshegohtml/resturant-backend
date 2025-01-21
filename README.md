# Weather Travel Planner

## App Description
The **Weather Travel Planner** is an interactive application designed to enhance travel planning by providing users with real-time weather insights, activity recommendations, and a seamless search experience for their favorite destinations. Key features include:

- **Destination Search**: Easily search for cities or locations to explore weather and activities.
- **Weather Integration**: View current weather conditions and a 7-day forecast, including temperature, humidity, wind speed, and general weather conditions.
- **Activity Recommendations**: Receive tailored activity suggestions based on weather conditions.
- **Favorites List**: Save your favorite destinations for quick access later.
- **Map Integration**: Visualize your selected destination on a map for better orientation.

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <https://github.com/Tshegohtml/weather-travel-planner.git>
   cd weather-travel-planner
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the root directory and add the following:
     ```env
     FIREBASE_API_KEY="",
     FIREBASE_AUTH_DOMAIN="",
     FIREBASE_PROJECT_ID="",
     FIREBASE_STORAGE_BUCKET="",
     FIREBASE_MESSAGING_SENDER_ID="",
     FIREBASE_APP_ID="",
     MEASUREMENT_ID="",
     GOOGLE_PLACES_API="",
     WEATHER_API="",
     ```

4. **Run the App**:
   ```bash
   npm start
   ```

5. **Build the App** (Optional):
   ```bash
   npm run build
   ```

---

## APIs Used

1. **Weather API**:
   - **Provider**: [OpenWeatherMap API](https://openweathermap.org/)
   - **Usage**: Fetch real-time weather data and 7-day forecasts.
   - **Endpoints**:
     - Current Weather: `/weather`
     - 7-Day Forecast: `/forecast`

2. **Activity Dataset/API**:
   - **Provider**: Predefined activity dataset or third-party API.
   - **Usage**: Retrieve activity recommendations based on weather conditions.

3. **Map API** (Bonus):
   - **Provider**: [Google Maps API](https://developers.google.com/maps)
   - **Usage**: Display the location of the selected destination on a map.

---

## Challenges and Solutions

1. **Challenge**: Integrating multiple APIs and managing asynchronous requests.
   - **Solution**: Used Axios for API calls and implemented proper error handling to ensure smooth user experience.

2. **Challenge**: Mapping weather conditions to appropriate activity suggestions.
   - **Solution**: Created a lookup table to map weather conditions to predefined activity categories for consistent and meaningful suggestions.

3. **Challenge**: Displaying real-time data on maps.
   - **Solution**: Integrated Google Maps API with React components, utilizing geocoding for precise destination plotting.

4. **Challenge**: Persisting user’s favorite destinations.
   - **Solution**: Used localStorage to store and retrieve the favorites list.


---

## Additional Features
- **Responsive Design**: The app is fully responsive and works seamlessly on desktop and mobile devices.
- **User-Friendly Interface**: Intuitive navigation and design for all age groups.

---

## Future Enhancements
- Add multi-language support for global usability.
- Include user authentication to sync favorites across devices.
- Introduce a trip planner feature to plan and save multi-day trips.

---



