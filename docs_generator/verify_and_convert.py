import os
import sys
import time
import win32com.client
from build_full_report import build_report, DOCX_PATH, PDF_PATH

def verify_and_export():
    # 1. Build initial document
    print("Building document...")
    build_report()
    
    # 2. Open Word via COM
    print("Launching Microsoft Word via COM Automation...")
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    word.DisplayAlerts = 0
    
    try:
        abs_docx = os.path.abspath(DOCX_PATH)
        abs_pdf = os.path.abspath(PDF_PATH)
        
        print(f"Opening {abs_docx} in Word...")
        doc = word.Documents.Open(abs_docx)
        
        # Force pagination update
        doc.Repaginate()
        time.sleep(1)
        
        # Compute page count (wdStatisticPages = 2)
        page_count = doc.ComputeStatistics(2)
        print(f"Word rendered page count: {page_count}")
        
        # Save as PDF (wdFormatPDF = 17)
        print(f"Exporting to PDF: {abs_pdf}...")
        doc.SaveAs(abs_pdf, FileFormat=17)
        print("PDF export successful!")
        
        doc.Close(False)
        return page_count
    finally:
        word.Quit()

if __name__ == "__main__":
    count = verify_and_export()
    print(f"Final Document Verification: Page Count = {count}")
