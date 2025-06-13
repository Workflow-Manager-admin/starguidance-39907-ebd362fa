import os
import requests
from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request

# Zodiac sign date ranges (western astrology)
ZODIAC_SIGNS = [
    ("Capricorn", (1, 1), (1, 19)),
    ("Aquarius", (1, 20), (2, 18)),
    ("Pisces", (2, 19), (3, 20)),
    ("Aries", (3, 21), (4, 19)),
    ("Taurus", (4, 20), (5, 20)),
    ("Gemini", (5, 21), (6, 20)),
    ("Cancer", (6, 21), (7, 22)),
    ("Leo", (7, 23), (8, 22)),
    ("Virgo", (8, 23), (9, 22)),
    ("Libra", (9, 23), (10, 22)),
    ("Scorpio", (10, 23), (11, 21)),
    ("Sagittarius", (11, 22), (12, 21)),
    ("Capricorn", (12, 22), (12, 31))  # Capricorn: spans new year
]

blp = Blueprint(
    "StarGuidance", "astro", url_prefix="/api", description="Astro/Horoscope API"
)


@blp.route("/horoscope", methods=["POST"])
class HoroscopeAPI(MethodView):
    """
    Receives user data and returns: zodiac sign, horoscope, AI guidance.
    Input JSON: { name, date, place, question }
    """

    def post(self):
        data = request.get_json()
        name = data.get("name")
        date = data.get("date")
        place = data.get("place")
        question = data.get("question") or ""

        if not (name and date and place):
            return {"error": "Missing data"}, 400

        # 1. Zodiac sign
        sign, sign_range = get_zodiac_from_date(date)

        # 2. Geocode location (if possible)
        lat, lon, location_info = geocode_place(place)

        # 3. Horoscope via aztro API
        horoscope = fetch_daily_horoscope(sign)

        # 4. AI Guidance: combine context & user question
        ai_guidance = generate_ai_guidance(
            name, sign, horoscope, question, location_info
        )

        result = {
            "zodiac_sign": sign,
            "zodiac_range": sign_range,
            "horoscope": horoscope,
            "ai_guidance": ai_guidance,
            "location": location_info,
        }
        return result, 200


# PUBLIC_INTERFACE
def get_zodiac_from_date(iso_date):
    """
    Given ISO date string 'YYYY-MM-DD', return zodiac sign and date range (e.g. 'Gemini', 'May 21 - Jun 20')
    """
    try:
        year, month, day = (int(part) for part in iso_date.split("-"))
    except Exception:
        return "Unknown", ""
    for sign, (start_m, start_d), (end_m, end_d) in ZODIAC_SIGNS:
        if (
            (month == start_m and day >= start_d)
            or (month == end_m and day <= end_d)
            or (start_m < month < end_m)
        ):
            # Render the date range
            months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ]
            rng = (
                f"{months[start_m - 1]} {start_d} - "
                f"{months[end_m - 1]} {end_d}"
            )
            return sign, rng
    # fallback (shouldn't happen)
    return "Unknown", ""


# PUBLIC_INTERFACE
def geocode_place(place_str):
    """
    Returns (lat, lon, location_dict) using OpenCage Data Geocoding.
    """
    OPEN_CAGE_KEY = os.environ.get("OPENCAGE_API_KEY", "")
    if not place_str or not OPEN_CAGE_KEY:
        return None, None, {}
    try:
        resp = requests.get(
            "https://api.opencagedata.com/geocode/v1/json",
            params={
                "q": place_str,
                "key": OPEN_CAGE_KEY,
                "limit": 1,
                "no_annotations": 1,
            },
            timeout=6,
        )
        dat = resp.json()
        if dat["results"]:
            result = dat["results"][0]
            coords = result.get("geometry", {})
            lat, lon = coords.get("lat"), coords.get("lng")
            components = result.get("components", {})
            return (
                lat,
                lon,
                {
                    "city": (
                        components.get("city")
                        or components.get("town")
                        or components.get("village")
                        or ""
                    ),
                    "country": components.get("country") or "",
                    "lat": lat,
                    "lon": lon,
                },
            )
    except Exception:
        pass
    return None, None, {}


# PUBLIC_INTERFACE
def fetch_daily_horoscope(zodiac_sign):
    """
    Fetches today's daily horoscope for the given zodiac sign using aztro API.
    Returns a text, or fallback message.
    """
    try:
        resp = requests.post(
            "https://aztro.sameerkumar.website/",
            params={
                "sign": zodiac_sign.lower(),
                "day": "today",
            },
            timeout=5,
        )
        if resp.status_code == 200:
            return resp.json().get("description", "No horoscope result found.")
    except Exception:
        return "Could not fetch horoscope right now."
    return "Could not fetch horoscope."


# PUBLIC_INTERFACE
def generate_ai_guidance(name, sign, horoscope, question, location):
    """
    Returns personalized guidance string using GPT (OpenAI) or HuggingFace.
    """
    # Compose a prompt
    base_prompt = (
        f"{name} was born under the zodiac sign {sign}."
        f" Today's horoscope reads: '{horoscope}'.\n"
        f"Location: {location.get('city', '')}, {location.get('country', '')}.\n"
    )

    if question:
        base_prompt += (
            f" The user asks: '{question}'.\n"
            "As a wise astrologer and life coach, please provide tailored and positive daily advice "
            "combining astrological insights and encouragement, responding to their concern."
        )
    else:
        base_prompt += (
            "Please provide a friendly, positive, and insightful daily piece of advice for them "
            "rooted in their zodiac sign."
        )

    # 1. Try OpenAI
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    if OPENAI_API_KEY:
        try:
            import openai
            openai.api_key = OPENAI_API_KEY
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a kind astrological life coach.",
                    },
                    {"role": "user", "content": base_prompt},
                ],
                temperature=0.83,
                max_tokens=120,
            )
            return response["choices"][0]["message"]["content"].strip()
        except Exception:
            pass

    # 2. Try Hugging Face Inference API
    HF_API_KEY = os.environ.get("HF_API_KEY", "")
    if HF_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {HF_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {"inputs": base_prompt}
            resp = requests.post(
                "https://api-inference.huggingface.co/models/gpt2",
                headers=headers,
                json=payload,
                timeout=10,
            )
            if (
                resp.status_code == 200
                and isinstance(resp.json(), list)
            ):
                generated = resp.json()[0].get("generated_text", "").strip()
                return (
                    generated
                    or "Positive energy is with you today."
                )
        except Exception:
            pass

    # fallback
    return (
        "Stay positive! The stars encourage you to embrace the day with confidence and kindness."
    )
