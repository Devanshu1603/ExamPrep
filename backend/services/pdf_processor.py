import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_any_pdf(pdf_path, output_txt_path=None):
    doc = fitz.open(pdf_path)
    full_text = ""

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # ✅ Try to extract digital text first
        text = page.get_text()
        
        if text.strip():
            full_text += f"\n--- Page {page_num + 1}: Digital Text ---\n{text}"
            continue  # Skip OCR if digital text is present

        # ❌ No digital text → fallback to OCR from images
        image_list = page.get_images(full=True)
        if not image_list:
            full_text += f"\n--- Page {page_num + 1}: No Text Found ---\n"
            continue

        print(f"OCR on Page {page_num + 1}...")

        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))

            # OCR
            ocr_text = pytesseract.image_to_string(image)
            full_text += f"\n--- Page {page_num + 1}, Image {img_index + 1}: OCR ---\n{ocr_text}"

    if output_txt_path:
        with open(output_txt_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"\n✅ Saved combined text to: {output_txt_path}")

    return full_text

# if __name__ == "__main__":
#     pdf_path = "uploades\CN pyq.pdf"  # Replace with your actual PDF filename
#     output_path = "extracted_text.txt"
    
#     result = extract_text_from_any_pdf(pdf_path, output_path)
#     print("\n🔍 Extracted Text Preview:\n", result[:1000])  # print first 1000 characters