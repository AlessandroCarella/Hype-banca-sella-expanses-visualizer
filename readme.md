todo:
fai prelievo da atm per vedere come viene registrato sul csv

everything that is not "Risparmi" in the column tipologia must be personalized by the user to split the type of transaction in various categories (like "fun", "food", "health", etc...)

automatically move the cleaned_csv file to the data folder in the src/data folder and rename it to data.csv

create install guide for python, node etc (i think only the node installer is necessary because it installs python by default)

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

