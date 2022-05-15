from flask import Flask, render_template
from projects import projects

app = Flask(__name__)

@app.route('/')
def portfolio():
    return render_template('portfolio.html', portfolio = projects)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/contact', methods=['POST'])
def send_email():
    return render_template('thankyou.html')




# if __name__ == '__main__':
#     app.run(debug=True)