from sentence_transformers import SentenceTransformer


class TextEncoder:
    def __init__(self):
        
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    @staticmethod
    def clean_text(text: str) -> str:
        
        text = text.lower().strip()
        text = " ".join(text.split())
        return text

    def encode(self, text: str):
        cleaned_text = self.clean_text(text)
        embedding = self.model.encode(cleaned_text)
        return embedding
