import banana_dev as banana
from utils import prompt_builder

# In-memory cache for the model
model_cache = {}

def init():
    """
    This function is called once when the server starts.
    It's used to load the model into memory.
    """
    # In a real scenario, you would load your Gemini Nano model here.
    # For this example, we'll simulate a loaded model.
    model_cache["model"] = "gemini-nano-placeholder"
    print("Model loaded successfully.")

def inference(model_inputs: dict) -> dict:
    """
    This function is called for every API request.
    It takes the model inputs and returns the model outputs.
    """
    if "model" not in model_cache:
        init()

    # 1. Get branding input from the request
    business_name = model_inputs.get("business_name", "DefaultBiz")
    style = model_inputs.get("style", "modern")
    colors = model_inputs.get("colors", ["black", "white"])
    symbols = model_inputs.get("symbols", ["circle"])

    # 2. Use the prompt builder to create a detailed prompt
    logo_description_prompt = prompt_builder.create_logo_prompt(
        business_name, style, colors, symbols
    )

    # 3. (Simulated) Call Gemini Nano to get a logo description
    # In a real implementation, you would call your model here.
    print(f"Generated prompt for model: {logo_description_prompt}")
    logo_description = f"A logo for {business_name}, which is {style}. It features the colors {', '.join(colors)} and incorporates {', '.join(symbols)}."

    # 4. (Simulated) Call an image generation model
    # This is where you would send the description to DALL-E, Stable Diffusion, etc.
    image_url = f"https://dummyimage.com/512x512/000/fff.png&text=Logo+for+{business_name.replace(' ', '+')}"

    # 5. Return the result
    return {
        "logo_description": logo_description,
        "image_url": image_url,
        "generated_prompt": logo_description_prompt
    }

# This is the entrypoint for the Banana server
if __name__ == "__main__":
    # For local testing, you can run this script directly
    init()
    test_input = {
      "business_name": "Luna Pet Supplies",
      "style": "playful and modern",
      "colors": ["blue", "white"],
      "symbols": ["moon", "dog"]
    }
    result = inference(test_input)
    print(result)
