// App.jsx
import React, { useState } from "react";
import "./App.css";
const backendURL = process.env.BACK_LINK;
function App() {
  const [inputs, setInputs] = useState({
    spx: "",
    uso: "", 
    slv: "",
    eurUsd: ""  // Changed from eur-usd to eurUsd
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    setLoading(true);

    try {
      const features = [
        parseFloat(inputs.spx),
        parseFloat(inputs.uso),
        parseFloat(inputs.slv),
        parseFloat(inputs.eurUsd)  // Updated here too
      ];

      const response = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });

      const data = await response.json();

      if (data.prediction !== undefined) {
        setPrediction(data.prediction.toFixed(2));
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Failed to connect to prediction server. Make sure the Flask backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="prediction-app">
        <h1 className="app-title">Gold Price Prediction</h1>
        <p className="app-subtitle">Enter market data to predict GLD gold price</p>
        
        <form className="prediction-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="number"
              step="0.01"
              name="spx"
              placeholder="S&P 500 Index (SPX)"
              value={inputs.spx}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              step="0.01"
              name="uso"
              placeholder="Oil Price (USO)"
              value={inputs.uso}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              step="0.01"
              name="slv"
              placeholder="Silver Price (SLV)"
              value={inputs.slv}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              step="0.000001"
              name="eurUsd"  // Updated here too
              placeholder="EUR/USD Exchange Rate"
              value={inputs.eurUsd}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="predict-button"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict Gold Price"}
          </button>
        </form>

        {loading && <div className="loading-spinner"></div>}

        {prediction !== null && (
          <div className="prediction-result">
            <div className="prediction-title">Predicted Gold Price (GLD)</div>
            <div className="prediction-value">${prediction}</div>
            <div className="prediction-unit">USD per share</div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default App;