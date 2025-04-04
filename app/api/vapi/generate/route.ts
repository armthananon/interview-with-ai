import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export const GET = async () => {
    return Response.json({ success: true, data: "TEST" }, { status: 200 });
}

export const POST = async (request: Request) => {
    const { type, role, level, techstack, amount, userid } = await request.json();

    try {
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            // prompt: `Prepare questions for a job interview. The job role is ${role}. The job experience level is ${level}. The related tech stack is ${techstack}. The focus between behavioural questions should lean toward: ${type}. The amount of questions is ${amount}. Please return only the questions, without any additional information. The questions are going to be read by a voice assistant so do not use "/" or any other special characters. Return the questions as a list format like this: ["Question 1", "Question 2", "Question 3"]`,
            prompt: `เตรียมคำถามสำหรับการสัมภาษณ์งาน บทบาทงานคือ ${role}. ระดับประสบการณ์งานคือ ${level}. เทคสแต็กที่เกี่ยวข้องคือ ${techstack}. จุดเน้นระหว่างคำถามเกี่ยวกับพฤติกรรมควรอยู่ที่ ${type}. จำนวนคำถามคือ ${amount}. โปรดส่งคำถามกลับเท่านั้น โดยไม่มีข้อมูลเพิ่มเติม คำถามจะถูกอ่านโดยผู้ช่วยเสียง ดังนั้นอย่าใช้ "/" หรืออักขระพิเศษอื่นๆ ส่งคำถามกลับเป็นรูปแบบรายการเช่นนี้: ["คำถาม 1", "คำถาม 2", "คำถาม 3"]`,
        })

        const interview = {
            type,
            role,
            level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        }

        await db.collection('interviews').add(interview);

        return Response.json({ success: true }, { status: 200 });
        
    } catch (error) {
        console.error(error);
        
        return Response.json({ success: false, error }, { status: 500 });
    }
}