import os
import json
from typing import List, Dict, Optional, Any
from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type

from config import Config
from schemas import GenerateRequest, GenerateResponse, Moderation # Import from schemas.py

class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)
        if not Config.OPENAI_API_KEY:
            print("Warning: OPENAI_API_KEY is not set. OpenAI API calls will fail.")

    @retry(stop=stop_after_attempt(2), wait=wait_fixed(1), retry=retry_if_exception_type(json.JSONDecodeError))
    def _call_openai_api(self, messages: List[Dict[str, str]]) -> str:
        if not self.client.api_key:
            raise ValueError("OpenAI API key is not configured.")

        response = self.client.chat.completions.create(
            model=Config.OPENAI_MODEL,
            messages=messages,
            max_tokens=Config.OPENAI_MAX_OUTPUT_TOKENS,
            temperature=Config.OPENAI_TEMPERATURE,
            response_format={"type": "json_object"} # Ensure JSON output
        )
        content = response.choices[0].message.content
        json.loads(content) # Validate JSON
        return content

    def generate_text(self, request: GenerateRequest) -> GenerateResponse:
        profile = request.profile if request.profile is not None else {}
        mood = request.mood if request.mood is not None else {}
        want = request.want if request.want is not None else []

        # Construct prompt
        system_prompt = (
            "당신은 안전한 창작 보조자입니다. "
            "한국어로 80~150자 내의 짧은 시 한 편을 JSON 형식으로만 반환하세요. "
            "응답은 반드시 {\"poem\": \"...\"} 형태여야 합니다. "
            "부적절하거나 유해한 내용은 생성하지 마세요."
        )

        user_prompt_parts = []
        if profile and profile.traits:
            traits_str = ", ".join([f"{k}:{v:.0f}" for k, v in profile.traits.model_dump().items() if v is not None])
            user_prompt_parts.append(f"성향: {traits_str}")
        if mood and mood.tags:
            tags_str = ", ".join(mood.tags)
            user_prompt_parts.append(f"감정 태그: {tags_str}")
        if mood and mood.intensity is not None:
            user_prompt_parts.append(f"감정 강도: {mood.intensity}")
        
        user_prompt = " ".join(user_prompt_parts) if user_prompt_parts else "평범한 일상에 대한 시를 써주세요."

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        poem_content = ""
        moderation_flags = []
        is_safe = True

        try:
            raw_response = self._call_openai_api(messages)
            response_data = json.loads(raw_response)
            poem_content = response_data.get("poem", "")

            # Local forbidden word filter (simple example)
            forbidden_words = ["욕설", "비속어", "혐오"]
            for word in forbidden_words:
                if word in poem_content:
                    is_safe = False
                    moderation_flags.append(f"forbidden_word:{word}")
                    poem_content = "생성된 시에 부적절한 내용이 포함되어 있습니다."
                    break # Only flag one forbidden word for simplicity

        except json.JSONDecodeError:
            poem_content = "OpenAI 응답 형식이 올바르지 않습니다."
            is_safe = False
            moderation_flags.append("invalid_json_format")
        except Exception as e:
            poem_content = f"시 생성 중 오류 발생: {e}"
            is_safe = False
            moderation_flags.append(f"api_error:{str(e)}")

        return GenerateResponse(
            poem=poem_content if "poem" in want else None,
            img_prompt=None, # Not implemented yet
            moderation=Moderation(safe=is_safe, flags=moderation_flags)
        )
