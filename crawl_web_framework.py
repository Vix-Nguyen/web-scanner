
from selenium.webdriver import ChromeOptions
from selenium import webdriver


JS_PATH = "check.js"

def execute_js_on_page(url, js_code):
    chrome_options = ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument("--window-size=1920x1080")

    driver = webdriver.Chrome(options=chrome_options)


    try:
        # Load the webpage
        driver.get(url)

        # Execute JavaScript code
        frameworks = driver.execute_script(js_code)

        print("Web frameworks:")
        for framework in frameworks:
            print(framework)
        print("")

    finally:
        # Close the browser window
        driver.quit()

def get_web_frameworks(url):
    javascript_code = open(JS_PATH).read()
    execute_js_on_page(url, javascript_code)
