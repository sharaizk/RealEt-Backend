import { model, Schema } from "mongoose";


const materialModel = new Schema({
    grayStructure: {
        blocks:[{name:{type:String},price:{type:String},image:{type:String}}],
        bricks:[{name:{type:String},price:{type:String},image:{type:String}}],
        cement:[{name:{type:String},price:{type:String},image:{type:String}}],
        gravel:[{name:{type:String},price:{type:String},image:{type:String}}],
        sand:[{name:{type:String},price:{type:String},image:{type:String}}],
        steel:[{name:{type:String},price:{type:String},image:{type:String}}]
    }
},{timestamps:true}
);


const material = model("Material",materialModel);
export default material;