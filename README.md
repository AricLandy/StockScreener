# Stock Screaner with Algorithmic Predictions

![Example Image](https://github.com/AricLandy/StockScreener/blob/master/Demo_image.png)

### How it works
The basics of how this app works are very simple. When the user enters the name of a NASDAQ exchange, a request is made to an Alphavantage API to get the current price and daily change. These results are then used to initialize a card component (card.js) and the results are displayed. On initialization of a card component, another request is made to Alphavantage to get the historical 200 day and 50 day simple moving average for that exchange. This data is used for the SMA prediction which is explained below.

### Technologies used
This app was mainly built using React, Material UI components, and Alphavantage API.


### SMA prediction
The SMA prediction is a basic algorithmic trading idea based off of the 50 and 200 day moving averages of a stock. When the 50 day goes above the 200 day - it is an indicator to buy. When the 50 day goes below the 200 day - it is an indicator to sell.
This prediction works by analyzing the difference between these two indicators at 10 days previous, 20 days previous and 30 days previous. If say the 50 day SMA was lower than the 200 day SMA for all three of those points but it is currently higher, the 50 day has just passed the 200 day and the indicator will advise to buy.
Obviously this isn't a perfect practice and neither is the implementation. If the stock price is not volatile, the 50 day and 200 day will be about the same and these minor fluctuations could falsely indicate to buy or sell.


### Free tier API 
Unfortunately I cannot get free information about all NASDAQ exchanges. I chose to use the free tier Alphavantage API during so I am not accidentally charged for a bug that makes millions of requests lol. That being said, when the program recognizes a request limit is displays the message "Due to using free data, this security will automatically be added as soon as possible". The program sets a timeout on the request to what it predicts will be when the request limit ends. You can add as many as you want to this "waiting list" and the timeout will set accordingly.

### Further Expansion
1. Automatically update stocks - due to using a free API this would be a little complicated but I could create a request queue for all requests from the app to accomplish this and organize all of the requests better.
2. Save data for users - This could be done using sessions on the front end to simply save state or more professionally I could connect the app to a database on the backend