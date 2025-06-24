import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import os
import platform
from config.env import PYTESSERACT_PATH  # ✅ Use from your centralized env.py

# ✅ Dynamically set the Tesseract path
if PYTESSERACT_PATH and os.path.exists(PYTESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = PYTESSERACT_PATH
elif platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
else:
    print("⚠️ Warning: Tesseract path not set or found!")


def extract_text_from_any_pdf(pdf_path, output_txt_path=None):
    doc = fitz.open(pdf_path)
    full_text = ""

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text()

        if text.strip():
            full_text += f"\n--- Page {page_num + 1}: Digital Text ---\n{text}"
            continue  # Digital text found, skip OCR

        # If no digital text, try OCR
        image_list = page.get_images(full=True)
        if not image_list:
            full_text += f"\n--- Page {page_num + 1}: No Text Found ---\n"
            continue

        print(f"🔍 OCR Required on Page {page_num + 1}...")

        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]

            try:
                img_pil = Image.open(io.BytesIO(image_bytes)).convert("L")  # Grayscale
                ocr_text = pytesseract.image_to_string(img_pil)

                if ocr_text.strip():
                    full_text += f"\n--- Page {page_num + 1}, Image {img_index + 1}: OCR Text ---\n{ocr_text}"
                else:
                    full_text += f"\n--- Page {page_num + 1}, Image {img_index + 1}: OCR Failed or No Text ---\n"
            except Exception as e:
                full_text += f"\n--- Page {page_num + 1}, Image {img_index + 1}: OCR Error ---\nError: {str(e)}\n"

    if output_txt_path:
        with open(output_txt_path, "w", encoding="utf-8") as f:
            f.write(full_text)

    return full_text
