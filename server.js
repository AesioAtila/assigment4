// Initializing
const express = require('express') 
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
//Mongoose
const mongoose = require('mongoose')
var url='mongodb://localhost:27017/edx-course-db';
mongoose.Promise = global.Promise
mongoose.connect(url,{ useNewUrlParser: true }, {useMongoClient: true})

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())


	const Account = mongoose.model('account', {
		name: String,
		balance: Number
	  })
	//Get
	app.get('/accounts', (req, res,next) => {
        Account.find({}, null, {sort: {_id: -1}}, (error, accounts) => {
            if (error) return next(error)
            res.send(accounts)
      })
    })
	//Post
	app.post('/accounts', (req, res, next) => {
        let accountData = new Account(req.body)
		accountData.save( (error,results) => {
			if(error) return next(error)
				res.send(results)
			})
		})
	
	app.put('/accounts/:id', (req, res, next) => {
        
          Account.findById(req.params.id, (error, account) => {
            if (error) return next(error)
            if (req.body.name) account.name = req.body.name
            if (req.body.balance) account.balance = req.body.balance
            account.save((error, results) => {
              res.send(results)
            })
          })
       })
	   
	   app.delete('/accounts/:id', (req, res, next) => {
	  Account.findById(req.params.id, (error, account) => {
		if (error) return next(error)
		account.remove((error, results) => {
		  if (error) return next(error)
		  res.send(results)
		})
	  })
	})

		app.use(errorhandler())

app.listen(3000)