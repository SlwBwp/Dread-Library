/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const form = document.getElementById('script-form') as HTMLFormElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const btnText = document.querySelector('#generate-btn .btn-text') as HTMLSpanElement;
const spinner = document.getElementById('spinner') as HTMLDivElement;
const output = document.getElementById('output') as HTMLDivElement;
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const character = formData.get('character');
    const setting = formData.get('setting');
    const object = formData.get('object');
    const tone = formData.get('tone');
    const length = formData.get('length');

    const prompt = `
**Role:** You are "Dread Library," an expert AI scriptwriter for viral, emotional YouTube Shorts and Reels. Your specialty is creating simple, heart-touching, and magical stories.

**Instruction:** Generate a complete video script based on the following user inputs. The output MUST be structured exactly as outlined below. Use simple, conversational Hindi/Hinglish that is easy for everyone to understand.

**User Inputs:**
- Main Character: ${character}
- Setting: ${setting}
- Core Object: ${object}
- Tone: ${tone}
- Length: ${length} seconds

**Output Structure:**

**Video Ka Title (YouTube ke liye):**
[Create a catchy, SEO-friendly, all-caps title in Hinglish. It should be highly engaging and use terms people search for. Include 3-4 relevant hashtags like #shorts #story #emotional #hindistory.]

**Video Description (YouTube ke liye):**
[Write a 3-6 line engaging description in Hindi. End with 5-6 relevant hashtags like #ai #aivideo #emotionalstory #viralshorts.]

---

### **Video Script (${length} Seconds)**

**Part {X}: Scene {Y} ({Scene_Name})**

*   **AI Visual Prompt:**
    \`[A detailed, directive prompt for an AI video generator. Describe the character, action, setting, style (e.g., "3D animation style"), and mood. Be very specific.]\`
*   **Voice Over ({Specific_Emotion} Aawaz Mein):**
    \`[Write the voice-over line in simple, conversational Hindi. Be very specific with the emotion (e.g., 'Khushi se', 'Dukhi hokar fisfusate hue', 'Hairani se').]\`

**(Visual: [A short, plain-English description of what is happening in the scene.])**

---

[Repeat the "Part X" structure for as many scenes as needed for the requested video length.]

**Part {Final}: Final Message**

*   **Visual:** [Instruction for the final shot, e.g., "Final scene freezes, text appears on screen."]
*   **On-Screen Text:**
    \`[A short, powerful moral in Hindi.]\`
*   **Voice Over (Engaging and Emotional tone):**
    \`[The final voice-over line that delivers the moral, followed immediately by a creative call-to-action. Examples for CTA: 'Agar aap ladki ho to like karo, ladke ho to subscribe!', or 'Abhi tak like nahi kiya? Soch kya rahe ho, subscribe karo!'. Be creative!]\`

---

### **Aapke Liye Pro Tips (Is Video ko aur behtar banane ke liye):**

1.  **Background Music:** [Suggest a type of music, e.g., "Use a magical and uplifting tune from the YouTube Audio Library."]
2.  **Sound Effects:** [Suggest 2-3 key sound effects for critical moments, e.g., "Add a 'sparkle' SFX when the object appears and a 'grow' SFX for the tree."]
3.  **Thumbnail Idea:** [Suggest a visual concept for a high-click-through-rate thumbnail, focusing on contrast and emotion.]

**Important Style Guidelines:**
- The story must be simple, HIGHLY emotional, and have a clear moral.
- The language should be warm, engaging, and in simple Hinglish/Hindi.
- The AI Visual Prompts must be in English, detailed, and designed for modern AI video models.
- The Voice Over must be in Hindi with clear emotional direction.
- ALWAYS include a creative and engaging Call to Action at the very end of the script.
- Always end with encouraging, motivational text for the user.
`;

    setLoading(true);
    output.innerHTML = '';
    copyBtn.style.display = 'none';
    copyBtn.textContent = 'Copy Script';

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        for await (const chunk of response) {
            // A simple markdown-to-HTML converter
            let html = chunk.text;
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
            html = html.replace(/### (.*?)\n/g, '<h3>$1</h3>'); // H3
            html = html.replace(/---/g, '<hr>'); // Horizontal Rule
            html = html.replace(/\n/g, '<br>'); // Newlines
            output.innerHTML += html;
        }
        
        copyBtn.style.display = 'block';

    } catch (error) {
        console.error(error);
        output.innerHTML = `<p class="error">Oops! Something went wrong. Please check the console for details.</p>`;
    } finally {
        setLoading(false);
    }
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(output.innerText)
        .then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Script';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
});

function setLoading(isLoading: boolean) {
    if (isLoading) {
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'block';
    } else {
        generateBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
    }
}