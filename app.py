from mailbox import MaildirMessage
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)


@app.route('/')
def portfolio():
    return render_template('portfolio.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/contact', methods=['POST'])
def send_email():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']
    print(name, email, message)
    return redirect(url_for('contact'))