import threading
import argparse

from crawl_infor import get_website_info
from crawl_web_framework import get_web_frameworks

def format_url(url):
    if not "http" in url:
        url = "https://" + url            
    return url

def scanner(url):
    url = format_url(url)
    get_website_info(url)
    get_web_frameworks(url)

    # Threading version
    # Since two functions is independent, we can execute them seperately
    # thread1 = threading.Thread(target=get_web_frameworks, args=[url])
    # thread2 = threading.Thread(target=get_website_info, args=[url])

    # thread1.start()
    # thread2.start()

    # thread1.join()
    # thread2.join()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='Web Scanner')
    parser.add_argument("url",
                        help="URL for scanning")
    args = parser.parse_args()
    
    scanner(args.url)
