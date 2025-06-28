import axios from "axios";

import { Journal } from "../models/MoodModel.js";

export const chatWithBot = async (req, res) => {
  let { messages, journalId } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ message: "Chat history (messages array) is required." });
  }

  try {
   
    const journal = await Journal.findById(journalId);

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }
    else{
      messages =  [
        {
          role: "user",
          content: `My mood is ${journal.mood} .`,
        },
        ...messages
      ]
      journal.messages = messages
      await journal.save()
    }
    

    // 🎭 Create system prompt for psychiatrist behavior
    const systemPrompt = {
      role: "system",
      content: `You are a compassionate and professional psychiatrist. Follow these guidelines:
      
      - Keep responses to 3-4 lines maximum
      - Show empathy and understanding
      - Ask thoughtful follow-up questions to keep the conversation flowing
      - Use therapeutic techniques like reflection, validation, and gentle probing
      - Maintain a warm, non-judgmental tone
      - Focus on the user's feelings and experiences
      - Avoid giving direct medical advice
      - Encourage self-reflection and emotional exploration
      - Use phrases like "How does that make you feel?", "Can you tell me more about that?", "What do you think might be behind those feelings?"
      
      Your goal is to create a safe space for the user to express themselves while gently guiding them toward self-discovery and emotional awareness.`,
    };

    // 🤖 Prepare messages with system prompt
    const messagesWithSystemPrompt = [systemPrompt, ...messages];

    // 🤖 Get bot reply from OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: messagesWithSystemPrompt,
        max_tokens: 150, // Limit response length
        temperature: 0.7, // Balanced creativity and consistency
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_API}`,
          "HTTP-Referer": "https://mind-care-frontend-ochre.vercel.app", // Your frontend URL
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.choices[0].message.content;

    const botMessage = {
      role: "assistant",
      content: botReply,
    };

    messages.push(botMessage);

    journal.messages = messages
    await journal.save()

    res.status(200).json({ botReply });
  } catch (error) {
    console.error("ChatWithBot error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to process chat." });
  }
};
