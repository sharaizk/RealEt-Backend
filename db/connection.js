import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://rehan:rehan@cluster0.qhfay.mongodb.net/realet?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((error) => {
    console.log("Error while connecting to Database");
    console.log(error.message);
  });
