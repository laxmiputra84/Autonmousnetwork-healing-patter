import os, sys, win32com.client
from docx import Document
import doc_builder

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = 0

def test_page(func, page_num):
    doc = doc_builder.create_document()
    func(doc)
    fname = f"test_p{page_num}.docx"
    p = os.path.abspath(fname)
    doc.save(p)
    try:
        d = word.Documents.Open(p)
        pg = d.ComputeStatistics(2)
        d.Close(False)
        print(f"Page {page_num}: PASSED (pages={pg})")
        return True
    except Exception as e:
        print(f"Page {page_num}: FAILED ({e})")
        return False

# Import page builder functions
import page_functions

try:
    for i in range(1, 13):
        fn = getattr(page_functions, f"build_page_{i}")
        ok = test_page(fn, i)
        if not ok:
            print(f"STOPPED AT PAGE {i}")
            break
finally:
    word.Quit()
