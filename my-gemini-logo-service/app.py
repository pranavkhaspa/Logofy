import os
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

# Tell Flask where your frontend files live
app = Flask(
    __name__,
    static_folder="frontend",        # for CSS, JS, images
    template_folder="frontend"       # for index.html
)
CORS(app)

HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}


def generate_logo_prompt(name, style, colors, symbols):
    prompt = (
        f"a modern, vector logo for a company named '{name}'. "
        f"Style: {style}, clean, minimalist, professional, 4k. "
        f"Colors: {colors}. "
        f"Iconography: {symbols}. "
        f"The logo should be on a clean, solid white background, suitable for branding."
    )
    return prompt


# ✅ Serve index.html at root
@app.route("/")
def serve_index():
    return render_template("index.html")


# ✅ Serve static files (CSS, JS, images) from /frontend
@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)


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

    prompt = generate_logo_prompt(business_name, style, ", ".join(colors), ", ".join(symbols))
    print(f"Generated Prompt: {prompt}")

    try:
        response = requests.post(API_URL, headers=headers, json={
            "inputs": prompt,
        })
        
        if response.status_code == 200:
            return response.content, 200, {'Content-Type': 'image/jpeg'}
        else:
            error_message = response.json().get("error", "Unknown error")
            print(f"Hugging Face API Error: {error_message}")
            return jsonify({"error": f"Error from image generation API: {error_message}"}), response.status_code

    except Exception as e:
        print(f"An exception occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
