//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema = new mongoose.Schema({
    title : String,
    content: String
  });
const Article = mongoose.model("article", articleSchema);

app.route("/articles")
    .get(function(req, res){
      Article.find({}, function(err,articlesResult){
        if(!err){
          res.send(articlesResult);
        }
      });
    })
    .post(function(req, res){
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  })
  article.save(function(err){
    if(!err){
      res.send("Successfully added a new article.")
    } else {
      res.send(err);
    }
  })
    })
    .delete(function(req, res){
      Article.deleteMany( function(err){
        if(!err){
          res.send("Successfully deleted all articles.");
        } else {
          rese.send(err);
        }
      })
     });

app.route("/articles/:articleTitle")
    .get(function(req, res){
      const foundTitle = req.params.articleTitle;
      Article.findOne({title: foundTitle }, function(err, foundArticle) {
        if(!err)
        {
          res.send(foundArticle);
        } else {
          res.send(err);
        }
      });
    })
    .put(function(req,res){
      const foundTitle = req.params.articleTitle;
      Article.update(
        {title: foundTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
          if(!err){
            res.send("Successfully updated")
          } else {
            res.send(err);
          }
        });
    })
    .patch(function(req,res){
      const foundTitle = req.params.articleTitle;
      Article.update(
        {title: foundTitle},
        {$set:{title: req.body.title, content: req.body.content}},
        function(err){
          if(!err){
            res.send("Successfully updated")
          } else {
            res.send(err);
          }
        });
    })
    .delete( function(req, res){
      const foundTitle = req.params.articleTitle;
      Article.deleteOne({title: foundTitle}, function(err){
        if(!err){
          res.send("Successfully deleted article.");
        } else {
          rese.send(err);
        }
      });
    });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});