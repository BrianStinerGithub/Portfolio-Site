from flask import Flask

app = Flask(__name__)

#homepage is portfolio.html
@app.route('/')
def portfolio():
    return app.send_static_file('portfolio.html')

@app.route('/about')
def about():
    return app.send_static_file('about.html')

@app.route('/contact')
def contact():
    return app.send_static_file('contact.html')