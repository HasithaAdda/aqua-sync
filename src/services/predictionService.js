const SPECIES_API_URL = "https://gis-based-smart-pisciculture-management.onrender.com/predict_species";
const ML_API_URL = "https://gis-based-smart-pisciculture-management.onrender.com/predict";

const fetchWithTimeout = async (url, options, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
};

// --- Species Prediction ---

const getLocalFallbackRecommendations = (temp, ph, salinity, turbidity) => {
    const scores = {
        "Whiteleg Shrimp": 0,
        "Tiger Shrimp": 0,
        "Tilapia": 0,
        "Catfish": 0,
        "Milkfish": 0,
    };

    // Whiteleg Shrimp
    if (temp >= 28 && temp <= 32) scores["Whiteleg Shrimp"] += 30;
    if (ph >= 7.5 && ph <= 8.5) scores["Whiteleg Shrimp"] += 20;
    if (salinity >= 15 && salinity <= 25) scores["Whiteleg Shrimp"] += 40;
    if (turbidity >= 20 && turbidity <= 50) scores["Whiteleg Shrimp"] += 10;

    // Tiger Shrimp
    if (temp >= 27 && temp <= 31) scores["Tiger Shrimp"] += 30;
    if (ph >= 7.5 && ph <= 8.5) scores["Tiger Shrimp"] += 20;
    if (salinity >= 15 && salinity <= 30) scores["Tiger Shrimp"] += 40;
    if (turbidity >= 25 && turbidity <= 55) scores["Tiger Shrimp"] += 10;

    // Tilapia
    if (temp >= 24 && temp <= 30) scores["Tilapia"] += 30;
    if (ph >= 6.5 && ph <= 8.5) scores["Tilapia"] += 20;
    if (salinity >= 0 && salinity <= 5) scores["Tilapia"] += 40;
    if (turbidity >= 10 && turbidity <= 30) scores["Tilapia"] += 10;

    // Catfish
    if (temp >= 25 && temp <= 32) scores["Catfish"] += 30;
    if (ph >= 6.5 && ph <= 8) scores["Catfish"] += 20;
    if (salinity >= 0 && salinity <= 8) scores["Catfish"] += 40;
    if (turbidity >= 15 && turbidity <= 40) scores["Catfish"] += 10;

    // Milkfish
    if (temp >= 26 && temp <= 32) scores["Milkfish"] += 30;
    if (ph >= 7 && ph <= 8.5) scores["Milkfish"] += 20;
    if (salinity >= 10 && salinity <= 35) scores["Milkfish"] += 40;
    if (turbidity >= 20 && turbidity <= 45) scores["Milkfish"] += 10;

    const results = [];
    Object.entries(scores).forEach(([species, score]) => {
        if (score >= 20) {
            let status = "";
            if (score >= 85) status = "Highly Suitable";
            else if (score >= 70) status = "Suitable";
            else if (score >= 50) status = "Moderately Suitable";
            else status = "Low Suitability";

            results.push({
                species,
                score,
                status,
                isLocalFallback: true
            });
        }
    });

    return results.sort((a, b) => b.score - a.score);
};

export const getSpeciesRecommendations = async (temp, ph, salinity, turbidity) => {
    try {
        const response = await fetchWithTimeout(SPECIES_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ temperature: temp, pH: ph, salinity, turbidity })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.recommendations) {
                return data.recommendations;
            }
        }
        console.log(`Species API HTTP Error. Falling back to local.`);
        return getLocalFallbackRecommendations(temp, ph, salinity, turbidity);
    } catch (err) {
        console.log(`Species API Exception: ${err.message}. Falling back to local.`);
        return getLocalFallbackRecommendations(temp, ph, salinity, turbidity);
    }
};

// --- Disease Prediction ---

const getBacterialInfectionRisk = (temperature, ph, salinity, turbidity) => {
    let riskScore = 0;
    if (turbidity > 30) riskScore += 2;
    else if (turbidity > 20) riskScore += 1;
    if (temperature >= 26 && temperature <= 32) riskScore += 1;
    if (ph >= 6.5 && ph <= 8.5) riskScore += 1;
    if (salinity <= 10) riskScore += 1;
    if (riskScore >= 4) return 'High';
    if (riskScore >= 2) return 'Moderate';
    return 'Low';
};

const getLocalFallbackDiseasePrediction = (species, temperature, ph, salinity, turbidity) => {
    const isSeabass = species.toLowerCase().includes("seabass");
    const minTemp = isSeabass ? 26.0 : 24.0;
    const maxTemp = isSeabass ? 32.0 : 30.0;
    const minPh   = isSeabass ? 7.0  : 6.5;
    const maxPh   = isSeabass ? 8.5  : 9.0;
    const maxTurb = isSeabass ? 20.0 : 25.0;
    const minSal  = isSeabass ? 10.0 : 0.0;
    const maxSal  = isSeabass ? 30.0 : 5.0;

    let riskScore = 0;
    const riskFactors = [];

    // Temperature
    if (temperature < minTemp - 2 || temperature > maxTemp + 2) {
        riskScore += 2; riskFactors.push("Critical Temp");
    } else if (temperature < minTemp || temperature > maxTemp) {
        riskScore += 1; riskFactors.push("Mild Temp Alert");
    }

    // pH
    if (ph < minPh - 0.5 || ph > maxPh + 0.5) {
        riskScore += 2; riskFactors.push("Critical pH");
    } else if (ph < minPh || ph > maxPh) {
        riskScore += 1; riskFactors.push("Mild pH Alert");
    }

    // Salinity
    if (salinity < minSal - 5 || salinity > maxSal + 5) {
        riskScore += 2; riskFactors.push("Critical Salinity");
    } else if (salinity < minSal || salinity > maxSal) {
        riskScore += 1; riskFactors.push("Unstable Salinity");
    }

    // Turbidity
    if (turbidity > maxTurb + 10) {
        riskScore += 2; riskFactors.push("Critical Turbidity");
    } else if (turbidity > maxTurb) {
        riskScore += 1; riskFactors.push("Elevated Turbidity");
    }

    const bacterialRisk = getBacterialInfectionRisk(temperature, ph, salinity, turbidity);

    let basePrediction;
    if (riskScore === 0) {
        basePrediction = "Healthy / Safe conditions (Local)";
    } else if (riskScore <= 2) {
        basePrediction = `Mild risk: ${riskFactors.join(', ')} (Local)`;
    } else {
        basePrediction = `High risk: ${riskFactors.join(', ')} (Local)`;
    }

    return `${basePrediction} | Bacterial Infection Risk: ${bacterialRisk}`;
};

export const getDiseasePrediction = async (species, temperature, ph, salinity, turbidity, doValue) => {
    try {
        const response = await fetchWithTimeout(ML_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ species, temperature, pH: ph, turbidity, do: doValue })
        });

        if (response.ok) {
            const data = await response.json();
            const basePrediction = data.prediction || "Unknown (API returned empty)";
            const bacterialRisk = getBacterialInfectionRisk(temperature, ph, salinity, turbidity);
            return `${basePrediction} | Bacterial Infection Risk: ${bacterialRisk}`;
        }
        console.log(`ML API HTTP Error. Falling back to local.`);
        return getLocalFallbackDiseasePrediction(species, temperature, ph, salinity, turbidity);
    } catch (err) {
        console.log(`ML API Exception: ${err.message}. Falling back to local.`);
        return getLocalFallbackDiseasePrediction(species, temperature, ph, salinity, turbidity);
    }
};
