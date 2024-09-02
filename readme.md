run the program:
To start the Flask server using the command line (cmd), follow these steps:
    1. Open a command prompt or terminal.
    2. Navigate to the directory containing your repository (Hype-banca-sella-expanses-visualizer).
    3. Run the following command:
        python src/backend/uploadCsv.py

To start the npm app (frontend), follow these steps:
    1. Open a command prompt or terminal.
    2. Navigate to the directory containing your repository (Hype-banca-sella-expanses-visualizer).
    3. Run the following command:
        npm install
        npm start

To install libraries in the venv:
C:\Users\alex1\Desktop\Hype-banca-sella-expanses-visualizer\backend\venv\Scripts\python.exe -m pip install *package*

------------------------------------------
todo:
implement more checks on the file type, name (check for bank default), columns in it and implement the fact that the file does not get saved if it is not valid.
The errors must be informative to the user so that they know what to do after and they can correct the error or override it.

fai prelievo da atm per vedere come viene registrato sul csv

everything that is not "Risparmi" in the column tipologia must be personalized by the user to split the type of transaction in various categories (like "fun", "food", "health", etc...)

create install guide for python, node etc (i think only the node installer is necessary because it installs python by default)

make 2 views, one let you choose between months and the other one let you choose between years.
when the month visualization each category is in a different color and the color is the same for the same category in different months.
when the year visualization each category is in a different color but there is a bar for each month where each bar is a single month and it is a stack bar plot with the colors of each category stack on top of each other.
In the month view sort the categories by the one the user spent the most in and the bars have different height based on the amount of money spent.
In the year view sort the months by the natural order but remember to have scaled height for each month to compare the amount spent from month to month.

one of the view that could be interesting to implement is a regression graph with predictions for the next months.

figma: https://www.figma.com/design/6uIzQVe9Cqjgtw2cy1MzsG/Untitled?node-id=1-7&node-type=FRAME&t=PsfOXF02ORcw27Hc-0

pages:
    load csv
    graphs
    user settings
    error page

------------------------------------------
colors:
the colors used in the app are:
background: #121212
background light mode: #f5f4f7
text: #ffffff
text light mode: #000000
title of section text: #6d7791
main color: #284bff
second main color: #8d9fff
other colors:
    blue 1: #263036
    blue 2 (used for text): #4496c7
    blue 3: #5cc5ff
    green: #90db9b
    yellow: #ffcd67
positive icons background: #323a64
positive icons internal: #5a75ff
negative icons background: #633b37
negative icons internal: #fc766a
inactive button: #505b7d
inactive button text: #6d7791
box background: #212121
box background light mode: #ffffff

------------------------------------------
story:
initially i used to have a parser for the pdf file given by the bank but they finally gave the option, using the app, to export the data in csv format.
i used to have just a excel generation which was splitted in different categories but i decided to implement a d3.js app for this repository

search for inspiration for the d3 app:
google searched: d3.js personal finance --> https://github.com/luism6n/finances-app
github searched: d3.js personal finance --> https://github.com/joshseyda/vest

after seeing those 2 examples i decided to not use them but search for other projects in github and take inspiration from them
query: personal finance
https://github.com/actualbudget/actual decided to install and check how it worked because it seemed very detailed. navigating the ui it feels very overcrowded with features, decided to not use it as main reference since does not feel very "unexpert user friendly". also many of the data in the various features of the app dont look like they can be directly extracted by the bank provided csv file.
https://github.com/maybe-finance/maybe seems more user friendly so i decided to install it and test it

------------------------------------------
data exploration:


------------------------------------------
to remember:
the csv file given by the bank is kinda currupted, or at least it is if you send it to telegram and download it back.
just open the file in excel and save it back as a csv file.
