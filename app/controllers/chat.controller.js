import { Chat } from "../models"
export const postMessage = async (req, res, next) => {
    const {message,name} = req?.body
    try {
        
    } catch (error) {
       return res.status(500).json(error) 
    }
}