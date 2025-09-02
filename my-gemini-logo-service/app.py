import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
# We will use a popular and powerful model for high-quality images.
# Using a specific logo model can sometimes result in lower resolution.
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"

headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}

def generate_logo_prompt(name, style, colors, symbols):
    """
    Creates a detailed, professional prompt for Stable Diffusion to generate a logo.
    """
    # Example of a more advanced prompt structure
    prompt = (
        f"a modern, vector logo for a company named '{name}'. "
        f"Style: {style}, clean, minimalist, professional, 4k. "
        f"Colors: {colors}. "
        f"Iconography: {symbols}. "
        f"The logo should be on a clean, solid white background, suitable for branding."
    )
    return prompt

@app.route("/generate-logo", methods=["POST"])
def generate_logo():
    json_data = request.get_json()

    if not json_data:
        return jsonify({"error": "No JSON data provided"}), 400

    business_name = json_data.get("business_name")
    style = json_data.get("style")
    colors = json_data.get("colors")
    symbols = json_data.get("symbols")

    if not all([business_name, style, colors, symbols]):
        return jsonify({"error": "Missing required fields"}), 400

    # 1. Create the detailed prompt
    prompt = generate_logo_prompt(business_name, style, ", ".join(colors), ", ".join(symbols))
    print(f"Generated Prompt: {prompt}")

    # 2. Call the Hugging Face API
    try:
        response = requests.post(API_URL, headers=headers, json={
            "inputs": prompt,
        })
        
        if response.status_code == 200:
            # The response is the image binary itself
            return response.content, 200, {'Content-Type': 'image/jpeg'}
        else:
            # Try to parse the error from Hugging Face
            error_message = response.json().get("error", "Unknown error")
            print(f"Hugging Face API Error: {error_message}")
            return jsonify({"error": f"Error from image generation API: {error_message}"}), response.status_code

    except Exception as e:
        print(f"An exception occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

if __name__ == "__main__":
    # For local testing, you can run this script directly
    # Make sure to have a .env file with your HUGGINGFACE_API_TOKEN
    app.run(debug=True, port=5000)
