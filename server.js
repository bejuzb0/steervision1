let express = require("express");
let app = express();

app.use(function(req,res, next){
    console.log(`${new Date()} - ${req.method} request for ${req.url}`);
    next();
}); 

app.use(express.static("./static"));

app.listen(process.env.PORT || 8080, function(){
    console.log("Serving on port 8080");
});