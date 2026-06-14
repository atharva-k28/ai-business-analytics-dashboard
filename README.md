# AI Business Analytics Dashboard

An AI-powered analytics dashboard that allows users to upload datasets and automatically generate profiling, exploratory data analysis (EDA), and business insights using Google's Gemini API.

---

## Features

### Dataset Upload
- Upload CSV datasets
- Automatic file processing using FastAPI

### Data Profiling
- Dataset shape (rows and columns)
- Feature listing
- Missing value analysis
- Duplicate detection
- Numerical feature detection
- Categorical feature detection
- Dataset preview

### Exploratory Data Analysis (EDA)
- Summary statistics
- Correlation analysis with target variable
- Relevant and irrelevant feature identification
- Outlier detection using IQR
- Unique value analysis for categorical features

### AI-Powered Insights
Using Google Gemini API, the application automatically generates:

- Executive Summary
- Key Insights
- Business Risks
- Recommendations

---

## Tech Stack

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Pandas
- NumPy

### AI
- Google Gemini API (`google-genai`)

---

## Project Architecture

```text
User Uploads CSV
        ↓
 FastAPI Backend
        ↓
 Data Profiling
        ↓
 Exploratory Data Analysis
        ↓
 Gemini AI Insight Generation
        ↓
 Interactive Dashboard
```

---

## API Endpoint

### Analyze Dataset

**POST** `/analyze-file`

### Input

Multipart form data:

- `file`: CSV dataset

### Response

Returns JSON containing:

- Profiling information
- EDA results
- AI-generated insights

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ai-business-analytics-dashboard
```

---

## Backend Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Current Capabilities

✅ CSV Upload

✅ Data Profiling

✅ Missing Value Analysis

✅ Duplicate Detection

✅ Numerical & Categorical Feature Detection

✅ Dataset Preview

✅ Summary Statistics

✅ Correlation Analysis

✅ Outlier Detection

✅ Unique Value Analysis

✅ AI Business Insights

---

## Future Enhancements

- Interactive charts using Recharts
- Download AI report as PDF
- Automatic target variable selection
- Feature engineering suggestions
- Model training and prediction
- Dataset cleaning recommendations
- Explainable AI visualizations

---

## Example Dataset

The project has been tested on:

- Kaggle House Prices Dataset

---

## Screenshots

_Add screenshots of your dashboard here._

---

## Author

**Atharva Kshirsagar**

B.Tech Computer Science Engineering

Frontend Developer | Data Science Enthusiast | AI Explorer

---

## License

This project is developed for educational and portfolio purposes.
