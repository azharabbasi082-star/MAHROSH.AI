import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app=express(), PORT=process.env.PORT||3000;
app.use(express.json({limit:"2mb"}));
app.use(express.static("public"));

const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const gemini=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

const SYSTEM_PROMPT=`You are MAHROSH AI, a professional multilingual AI assistant created for Mahrosh Azhar's computer exhibition.
Answer accurately, naturally and helpfully.
If the user writes Urdu, answer in Urdu. If Roman Urdu, answer in Roman Urdu. If English, answer in English. Understand Hindi too.
Be friendly, professional, intelligent and suitable for students and families.
You can help with science, mathematics, computers, programming, history, geography, education, technology, writing, translation, stories and everyday questions.
Your name is MAHROSH AI. Do not claim to be ChatGPT.
For current information, use available search capability. Never invent facts when uncertain.`;

app.post("/api/chat",async(req,res)=>{
 const {message,history=[]}=req.body;
 if(!message?.trim())return res.status(400).json({error:"Please enter a question."});
 try{
  const input=[
   {role:"system",content:SYSTEM_PROMPT},
   ...history.slice(-12),
   {role:"user",content:message}
  ];
  const response=await openai.responses.create({
   model:process.env.OPENAI_MODEL||"gpt-5",
   input
  });
  return res.json({answer:response.output_text,provider:"OpenAI"});
 }catch(openaiError){
  console.log("OpenAI failed; trying Gemini:",openaiError.message);
  try{
   const prompt=`${SYSTEM_PROMPT}\n\nConversation:\n${history.slice(-12).map(x=>x.role+": "+x.content).join("\n")}\n\nUser:\n${message}`;
   const response=await gemini.interactions.create({
    model:process.env.GEMINI_MODEL||"gemini-2.5-flash",
    input:prompt,
    tools:[{type:"google_search"}]
   });
   return res.json({answer:response.output_text,provider:"Google Gemini"});
  }catch(geminiError){
   console.error("Gemini:",geminiError.message);
   return res.status(500).json({error:"AI services are temporarily unavailable. Please check your API keys and internet connection."});
  }
 }
});
app.listen(PORT,()=>console.log(`MAHROSH AI running at http://localhost:${PORT}`));