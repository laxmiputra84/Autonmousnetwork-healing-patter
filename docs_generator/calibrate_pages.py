import os, sys, win32com.client
from docx import Document
import doc_builder
import page_functions

word = win32com.client.Dispatch("Word.Application")
word.Visible = False
word.DisplayAlerts = 0

def check_single_page(page_num):
    doc = doc_builder.create_document()
    fn = getattr(page_functions, f"build_page_{page_num}")
    fn(doc)
    fname = f"calib_p{page_num}.docx"
    p = os.path.abspath(fname)
    doc.save(p)
    
    d = word.Documents.Open(p)
    d.Repaginate()
    pg = d.ComputeStatistics(2)
    
    overflow_info = []
    if pg > 1:
        for i in range(1, d.Paragraphs.Count + 1):
            para = d.Paragraphs(i)
            p_num = para.Range.Information(3) # wdActiveEndPageNumber
            if p_num > 1:
                overflow_info.append(f"Para {i}: {para.Range.Text[:60].strip()}")
    d.Close(False)
    return pg, overflow_info

try:
    all_ok = True
    for i in range(1, 13):
        pages, overflow = check_single_page(i)
        if pages == 1:
            print(f"Page {i:2d}: PERFECT (1 page)")
        else:
            print(f"Page {i:2d}: OVERFLOW ({pages} pages) -> {len(overflow)} overflowing paras:")
            for o in overflow[:3]:
                print(f"         {o}")
            all_ok = False
            
    print("=" * 50)
    if all_ok:
        print("ALL 12 PAGES ARE EXACTLY 1 PAGE EACH!")
    else:
        print("SOME PAGES NEED MINOR ADJUSTMENTS TO FIT 1 PAGE.")
finally:
    word.Quit()
