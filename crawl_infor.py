from urllib.parse import urlparse
import requests
import ssl
from bs4 import BeautifulSoup
import whois # whois get trouble with Windows, use Linux/MacOs to avoid problems

def get_web_app_info(soup, url):
    try:
        # Extract technologies and frameworks information
        technologies_used = soup.find_all('meta', attrs={'name': 'generator'})
        javascript_libraries = soup.find_all('script', src=True)

        # Extract directory and file structure
        links = soup.find_all('a', href=True)
        directories_files = [link['href'] for link in links]

        # Extract robots.txt content
        robots_txt_url = url.rstrip('/') + '/robots.txt'
        robots_txt_response = requests.get(robots_txt_url)
        robots_txt_content = robots_txt_response.text if robots_txt_response.status_code == 200 else "N/A"

        # Print or store the extracted information
        print(
            f"Technologies Used: {[tech['content'] for tech in technologies_used]}\n")
        print(
            f"JavaScript Libraries: {[lib['src'] for lib in javascript_libraries]}\n")
        print(f"Directory and File Structure: {directories_files}\n")
        print(f"Robots.txt Content:\n{robots_txt_content}\n")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


def get_web_server_info(response, url):
    try:
        # Extract server information from the response headers
        server_info = response.headers.get('Server', 'N/A')
        server_headers = response.headers

        # Check if SSL/TLS is used and extract certificate details
        if response.url.startswith("https"):
            ssl_info = ssl.get_server_certificate(
                (urlparse(url).hostname, 443))
        else:
            ssl_info = "SSL/TLS not used"

        # Print or store the extracted information
        print(f"Web Server: {server_info}")
        print(f"Server Headers: {server_headers}")
        print(f"SSL/TLS Certificate Details: {ssl_info}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


def get_title(soup):
    # Extract information from the HTML (customize as needed)
    title = soup.title.text if soup.title else "N/A"
    meta_description = soup.find('meta', attrs={'name': 'description'})
    description = meta_description['content'] if meta_description else "N/A"

    # Print or store the extracted information
    print(f"Title: {title}")
    print(f"Description: {description}\n")


def get_whois(url):
    w = whois.whois(url)
    print(f"Whois info: {w}")


def get_website_info(url):
    try:
        # Send an HTTP GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad responses (4xx or 5xx)

        # Parse the HTML content of the page
        soup = BeautifulSoup(response.text, 'html.parser')
        # not much optimization here for threading
        # we can use the sequential code
        get_whois(url)
        get_title(soup)
        get_web_server_info(response, url)
        get_web_app_info(soup, url)

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
