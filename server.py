from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

#homepage is portfolio.html
@app.route('/')
def portfolio():
    return render_template('portfolio.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')