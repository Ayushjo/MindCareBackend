import { Journal} from "../models/MoodModel.js";
import { User } from "../models/UserModel.js";
import { getIdFromToken } from "../utils/getIdFromToken.js";
export const submitMood = async (req, res) => {
  const { mood, token } = req.body;

  try {
    const userId = getIdFromToken(token);

    const latestMoodArray = {
      date:new Date(),
      mood:mood
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.moodLogs.push(latestMoodArray);
    await user.save()
    const journal = await Journal.create({userId,mood})
    if(!journal){
      console.log("Could not Create Journal");
      
    }
    const moodResponses = {
      happy: "That's great to hear! Want to share what made your day so good?",
      sad: "I'm sorry you're feeling down. Want to talk about it?",
      anxious:
        "Feeling anxious can be tough. I'm here for you. Want to share more?",
      angry:
        "It's okay to feel angry. Do you want to talk about what's bothering you?",
      neutral: "Even ordinary days matter. Want to reflect on something today?",
    };

    const botMessage =
      moodResponses[mood.toLowerCase()] || "How are you feeling today?";

    return res.status(200).json({
      message: "Mood submitted successfully",
      mood:user.moodLogs,
      botMessage,
      journalId:journal._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllMoods = async (req, res) => {
  const {token} = req.body
  try {
    const userId = getIdFromToken(token);
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Unauthorized, please login first" });
    } else {
      const user = await User.findById(userId);
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addNote = async (req, res) => {
  const { note, moodId } = req.body;
  try {
    const updatedMood = await Mood.findByIdAndUpdate(
      moodId,
      { note },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Note added Successfully", updatedMood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
