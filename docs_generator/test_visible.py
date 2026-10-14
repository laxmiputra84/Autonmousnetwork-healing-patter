import win32com.client, os, time

word = win32com.client.Dispatch("Word.Application")
word.Visible = True
doc_path = os.path.abspath(r"d:\Autonomous Network Healing Platform\docs_generator\Autonomous_Network_Healing_Platform_Documentation.docx")
print("Opening with Visible=True...")
try:
    doc = word.Documents.Open(doc_path)
    print("Opened successfully! Pages:", doc.ComputeStatistics(2))
    doc.SaveAs2(os.path.abspath(r"d:\Autonomous Network Healing Platform\docs_generator\output.pdf"), 17)
    print("PDF saved!")
    doc.Close(False)
except Exception as e:
    print("Error:", e)
finally:
    word.Quit()
