import os
import sys
import time
import win32com.client
from build_full_report import build_report, DOCX_PATH, PDF_PATH

print("Building fresh document...")
docx_file = build_report()
print(f"Document saved to: {docx_file}")

print("Opening in Microsoft Word via COM...")
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = 0

try:
    abs_docx = os.path.abspath(docx_file)
    abs_pdf = os.path.abspath(PDF_PATH)
    
    doc = word.Documents.Open(abs_docx)
    doc.Repaginate()
    
    pages = doc.ComputeStatistics(2)
    print(f"==========================================")
    print(f"WORD COMPUTED PAGE COUNT: {pages}")
    print(f"==========================================")
    
    # Export to PDF (17 = wdFormatPDF)
    print(f"Exporting to PDF: {abs_pdf}...")
    doc.SaveAs2(abs_pdf, FileFormat=17)
    print("PDF export successful!")
    
    doc.Close(False)
finally:
    word.Quit()

print("ALL OPERATIONS COMPLETED SUCCESSFULLY!")
