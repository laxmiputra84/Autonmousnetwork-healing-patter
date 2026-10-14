import os
import sys
import win32com.client

docx_path = os.path.abspath(r"d:\Autonomous Network Healing Platform\docs_generator\Autonomous_Network_Healing_Platform_Documentation.docx")
pdf_path = os.path.abspath(r"d:\Autonomous Network Healing Platform\docs_generator\Autonomous_Network_Healing_Platform_Documentation.pdf")

print("Initializing Word...")
word = win32com.client.DispatchEx("Word.Application")
word.Visible = False
word.DisplayAlerts = 0

try:
    print(f"Opening {docx_path}...")
    doc = word.Documents.Open(
        FileName=docx_path,
        ConfirmConversions=False,
        ReadOnly=True,
        AddToRecentFiles=False
    )
    print("Document opened successfully.")
    
    # Compute pages
    # wdStatisticPages = 2
    pages = doc.ComputeStatistics(2)
    print(f"Computed pages: {pages}")
    
    # Try export as PDF
    print("Exporting PDF...")
    # 17 = wdFormatPDF
    doc.SaveAs2(FileName=pdf_path, FileFormat=17)
    print("PDF saved successfully.")
    
    doc.Close(False)
    print("Done.")
except Exception as e:
    print(f"Error: {e}")
finally:
    word.Quit()
