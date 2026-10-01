import jwt from 'jsonwebtoken'; import { config } from '../config.js';
export const requireAuth=(req,res,next)=>{const token=req.headers.authorization?.replace(/^Bearer\s+/,'');if(!token)return res.status(401).json({message:'Authentication required'});try{req.user=jwt.verify(token,config.jwtSecret);next()}catch{return res.status(401).json({message:'Invalid or expired token'})}};
