import { Journal } from "../models/MoodModel.js";
import { getIdFromToken } from "../utils/getIdFromToken.js";
export const getAllChats = async (req, res) => {
  const { token } = req.body;

  try {
    const userId = getIdFromToken(token);

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Unauthorized, please login first" });
    }
    const chats = await Journal.find({ userId }).sort({ createdAt: -1 });
    const formattedChats = chats.map((chat) => ({
      ...chat.toObject(),
      createdAtIST: new Date(chat.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      updatedAtIST: new Date(chat.updatedAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    }));
    return res.status(200).json({ chats: formattedChats });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
