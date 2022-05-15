# yaml file runs this script to create a static website
import flask_frozen import Freezer
import app

freezer = Freezer(app)

if __name__ == '__main__':
    freezer.freeze()


