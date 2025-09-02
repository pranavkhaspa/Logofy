def create_logo_prompt(business_name: str, style: str, colors: list, symbols: list) -> str:
    """
    Creates a detailed text prompt for an image generation model 
    to design a logo based on provided brand attributes.
    """
    color_str = ", ".join(colors)
    symbol_str = ", ".join(symbols)

    prompt = (
        f"Create a professional and memorable logo for a business named '{business_name}'.\n"
        f"The desired style is {style}.\n"
        f"The primary colors should be {color_str}.\n"
        f"Incorporate the following symbols or ideas: {symbol_str}.\n"
        f"The logo should be clean, scalable, and work well on both light and dark backgrounds. "
        f"Generate a vector-style, minimalist design."
    )

    return prompt
