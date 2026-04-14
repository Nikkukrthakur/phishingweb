from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import re
import os
from urllib.parse import urlparse
from scipy.sparse import hstack

from nltk.tokenize import RegexpTokenizer
from nltk.stem.snowball import SnowballStemmer

# =========================
# LOAD MODEL (SAFE PATH)
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
vectorizer = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))

# =========================
# FASTAPI APP + CORS
# =========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# NLP SETUP
# =========================

tokenizer = RegexpTokenizer(r'[A-Za-z]+')
stemmer = SnowballStemmer('english')

def preprocess_text(url):
    tokens = tokenizer.tokenize(url)
    stemmed = [stemmer.stem(word) for word in tokens]
    return " ".join(stemmed)

# =========================
# FEATURE EXTRACTION
# =========================

def add_protocol_smart(url):
    trusted = ['google', 'github', 'amazon', 'facebook']
    if any(t in url for t in trusted):
        return "https://" + url
    else:
        return "http://" + url

def extract_url_features(url):
    url = add_protocol_smart(url)

    features = []
    features.append(len(url))
    features.append(url.count('.'))
    features.append(1 if '@' in url else 0)
    features.append(1 if '-' in url else 0)
    features.append(1 if url.startswith("https") else 0)
    features.append(1 if re.search(r'\d+\.\d+\.\d+\.\d+', url) else 0)

    try:
        features.append(urlparse(url).netloc.count('.'))
    except:
        features.append(0)

    keywords = ['login', 'verify', 'bank', 'secure', 'account']
    features.append(1 if any(k in url for k in keywords) else 0)

    features.append(sum(c.isdigit() for c in url))
    features.append(1 if len(url) > 75 else 0)

    return features

# =========================
# API ROUTES
# =========================

@app.get("/")
def home():
    return {"message": "Phishing Detection API Running 🚀"}

@app.get("/predict")
def predict(url: str):
    processed = preprocess_text(url)
    nlp_feat = vectorizer.transform([processed])
    url_feat = np.array(extract_url_features(url)).reshape(1, -1)

    features = hstack([nlp_feat, url_feat])

    pred = model.predict(features)[0]
    prob = model.predict_proba(features).max()

    result = "Phishing" if pred == 1 else "Legitimate"

    # =========================
    # 🔥 ISSUE DETECTION LOGIC
    # =========================

    issues = []

    if len(url) > 75:
        issues.append("URL is too long")

    if url.count('.') > 3:
        issues.append("Too many subdomains")

    if '@' in url:
        issues.append("Contains @ symbol")

    if '-' in url:
        issues.append("Contains hyphen (-)")

    if re.search(r'\d+\.\d+\.\d+\.\d+', url):
        issues.append("Uses IP address instead of domain")

    if any(k in url.lower() for k in ['login', 'verify', 'bank', 'secure', 'account']):
        issues.append("Contains suspicious keyword")

    if sum(c.isdigit() for c in url) > 5:
        issues.append("Too many digits in URL")

    if not url.startswith("https"):
        issues.append("Not using HTTPS")

    # =========================

    return {
        "url": url,
        "prediction": result,
        "risk_score": round(float(prob), 2),
        "issues": issues
    }