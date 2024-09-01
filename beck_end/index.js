const port = 4000;
const express = require("express");
const app = express();
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");
const multer =require("multer");
const path = require("path")
//using this path we can get access to our backend directory in our epress
const cors = require("cors");
const { type } = require("os");


app.use(express.json()); //using this whatever request we will get from reaponse tht will be automatically passed through json
app.use(cors());

//databse connection with mongoDB
mongoose.connect("mongodb+srv://gauravkumar111ik:JjXlqP5wPXXdcI1T@cluster0.agmmf.mongodb.net/e-commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

//Api creation 
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})
// Image storage engine

const storage = multer.diskStorage({
    destination : './upload/images',
    filename :(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})
//creating upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res)=>{
    if (!req.file) {
        return res.status(400).json({
            success: 0,
            message: "No file uploaded"
        });
    }
    
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});
//Schema for Creating products using mogoose library
const Product =mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,//here "ture" means if we want to upload any product without name  then it wont be uploaded on database 
    },
    image:{
        type:String,
        required:true,
    },
    //here is category
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})
//end point
app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
//end(creating Api for deleting) point for removing  product from our database
app.post('/removeproduct', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        console.log("Removed");
        res.json({
            success: true,
            message: `Product '${req.body.name}' removed successfully`,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while removing the product"
        });
    }
});
 //creating API for getting all product
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products Fetched");
    res.send(products);
})
//schema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
//Creating Endpoint for registering the user
app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check)
    {
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token  = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})
//creating endpoint for the suer login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email}); 
    if (user) {
        const passCompare =req.body.password === user.password; 
            if (passCompare) {
                const data = {
                    user: {
                       id:user.id
                     }
                }
                const token = jwt.sign(data,'secret_ecom');
                res.json({success:true,token});
            }
            else{
                res.json({success:false,errors:"Wrong Password"});
            }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})


// creating endpoint for newcollection data 
app.get('/newcollections', async (req, res) => {
    try {
      // Fetch the last 8 products after skipping the first one
      let newcollection = await Product.find({})
        .skip(1)
        .limit(8)
        .sort({ _id: -1 }); // Sort by descending order of _id to get the latest products
  
      console.log("NewCollection Fetched");
      res.send(newcollection);
    } catch (error) {
      console.error("Error fetching NewCollection:", error);
      res.status(500).send("An error occurred while fetching the collection.");
    }
  });
  
//creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})
//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }
        catch(error)
        {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
}

//creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        console.log("Added",req.body.itemId);
        // Use _id if you're working with MongoDB's default ObjectId
        let userData = await Users.findOne({ _id: req.user.id });

        // Handle case where user is not found
        if (!userData) {
            return res.status(404).send({ error: "User not found" });
        }

        // Ensure cartData exists and initialize if necessary
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Handle if itemId does not exist in cartData
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = 0;
        }

        // Increment the cart quantity for the item
        userData.cartData[req.body.itemId] += 1;

        // Save the updated cartData
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

        res.send("Added");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("An error occurred while adding the item to the cart.");
    }
});

// Endpoint for removing products from cartData
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        console.log("removed",req.body.itemId);
        // Use _id if you're working with MongoDB's default ObjectId
        let userData = await Users.findOne({ _id: req.user.id });

        // Handle case where user is not found
        if (!userData) {
            return res.status(404).send({ error: "User not found" });
        }

        // Ensure cartData exists
        if (!userData.cartData || !userData.cartData[req.body.itemId]) {
            return res.status(400).send({ error: "Item not found in cart" });
        }

        // Decrement the cart quantity for the item
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
        }
        // Save the updated cartData
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

        res.send("Removed from cart");
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).send("An error occurred while removing the item from the cart.");
    }
});

app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
  
    // Find the user by their ID, which is set in the `fetchUser` middleware.
    let userData = await Users.findOne({ _id: req.user.id });
  
    // Return the user's cart data as a JSON response.
    res.json(userData.cartData);
  });
  

app.listen(port,(error)=>{
    if(!error)
    {
        console.log("Server Running on Port " + port)
    }
    else{
        console.log("Error : "+error)
    }
})
