# StarGuidance Flask Backend

Backend for StarGuidance: calculates zodiac sign, fetches horoscope (Aztro API), geocodes location (OpenCage), and generates AI advice (OpenAI or HuggingFace).

## Endpoints

- **POST `/api/horoscope`**  
  **Input** (JSON):
  ```
  {
    "name": "Alice",
    "date": "1995-06-13",
    "place": "Berlin, Germany",
    "question": "Career advice"
  }
  ```
  **Returns** (JSON):
  ```
  {
    "zodiac_sign": "Gemini",
    "zodiac_range": "May 21 - Jun 20",
    "horoscope": "Today you will...",
    "ai_guidance": "Positive, tailored advice here.",
    "location": {"city": "Berlin", "country": "Germany", ...}
  }
  ```

## API Keys

- **OpenCage (geocoding)**: Set `OPENCAGE_API_KEY` in your environment
- **OpenAI GPT or HuggingFace**: Set `OPENAI_API_KEY` **or** `HF_API_KEY` in your environment (optional for AI guidance)

Example:
```sh
export OPENCAGE_API_KEY=sk-123...
export OPENAI_API_KEY=sk-123...
# or HF_API_KEY
```

## Run in development
```sh
flask run --host 0.0.0.0 --port 5000 --reload
```

## Sources

- [Aztro Horoscope API](https://aztro.sameerkumar.website/)
- [OpenCage Geocoding](https://opencagedata.com/)
- [OpenAI API](https://platform.openai.com/)
