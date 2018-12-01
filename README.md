# Netflix take home

Netflix take home assignment

## Getting Started

### Prerequisites

NodeJS + NPM are needed

### How to start
```
npm start
```

## Usage

### Reset
Reset the database for demo
```
http://localhost:8080/api/reset
```

### List all plans
List out plans for verify
```
http://localhost:8080/api/PlanInfo
```

### List all users
```
http://localhost:8080/api/UserSubscription
```
### List all users impacted by price change
List out plans for verify
```
http://localhost:8080/api/PlanInfo
```

### Price change 
http://localhost:8080/api/priceChange/:plan_id/:new_price
```
Examples
http://localhost:8080/api/priceChange/s1-sg/111
```

## Demo - localhost
* npm start
* Goto http://localhost:8080/api/reset to reset
* Goto http://localhost:8080/api/PlanInfo so we know s1-us is priced at 799
* Goto http://localhost:8080/api/UserSubscription so we know a1,b5,c2 will be affectd by the price change
* Goto http://localhost:8080/api/priceChange/s1-us/666 which will update the PlanInfo and create a task(to simulate a longer task, you can go to jobs/FindImpactUser.js and increase the sleep time)
* Goto http://localhost:8080/api/PlanInfo and you will see s1-us price is changed to 666
* Goto http://localhost:8080/api/queue and you will see a very simple task status for the job created.
* Goto http://localhost:8080/api/impactList and you will see impacted users which will feed to front end for confirmation.
* Goto http://localhost:8080/api/client/a1 and you will see a simple message ask you to confirm. I didn't implement the back fill after confirmation though.

## Demo - heroku
* I deploy the solution to heroku if you don't want to build a local version
* [Reset](http://jppjff-price.herokuapp.com/api/reset)
* [List Plan](http://jppjff-price.herokuapp.com/api/PlanInfo) so we know s1-us is priced at 799
* [List Users](http://jppjff-price.herokuapp.com/api/UserSubscription) so we know a1,b5,c2 will be affectd by the price change
* [Change s1-us to 666](http://jppjff-price.herokuapp.com/api/priceChange/s1-us/666) which will update the PlanInfo and create a task(to simulate a longer task, you can go to jobs/FindImpactUser.js and increase the sleep time)
* [List Plan](http://jppjff-price.herokuapp.com/api/PlanInfo) and you will see s1-us price is changed to 666
* [Monitor Task Queue](http://jppjff-price.herokuapp.com/api/queue) and you will see a very simple task status for the job created.
* [List Impact User](http://jppjff-price.herokuapp.com/api/impactList) and you will see impacted users which will feed to front end for confirmation.
* [Check Frontend](http://jppjff-price.herokuapp.com/api/client/a1) and you will see a simple message ask you to confirm. I didn't implement the back fill after confirmation though.

## Running the tests
```
npm test
```
