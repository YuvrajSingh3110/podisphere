import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.RAPID_API_KEY,
});

const apiKey = process.env.RAPID_API_KEY;
console.log(apiKey);
export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const url = "https://open-ai21.p.rapidapi.com/texttospeech";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": apiKey!,
        "x-rapidapi-host": "open-ai21.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: input,
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      return buffer;
    } catch (error) {
      console.error("Error generating TTS:", error);
      throw new Error("Failed to generate text-to-speech");
    }

    // const mp3 = await openai.audio.speech.create({
    //   model: "tts-1",
    //   voice: voice as SpeechCreateParams["voice"],
    //   input,
    // });

    // const buffer = await mp3.arrayBuffer();

    // return buffer;
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const url = response.data[0].url;

    if (!url) {
      throw new Error("Error generating thumbnail");
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});
