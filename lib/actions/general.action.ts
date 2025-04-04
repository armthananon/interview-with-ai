"use server";
import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export const getInterviewsByUserId = async (userId: string): Promise<Interview[] | null> => {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
};

export const getLatestInterviews = async (params: GetLatestInterviewsParams): Promise<Interview[] | null> => {
    const { userId, limit = 20 } = params;

    const interviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
};

export const getInterviewById = async (id: string): Promise<Interview | null> => {
    const interview = await db
        .collection("interviews")
        .doc(id)
        .get();

    return interview.data() as Interview | null;
};

export const createFeedback = async (params: CreateFeedbackParams) => {
    const { interviewId, userId, transcript } = params;

    try {
        const formattedTranscript = transcript
            .map((sentence: { role: string; content: string; }) => (
                `${sentence.role}: ${sentence.content}\n`
            )).join("");

        const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment} } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            // prompt: `
            //     You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            //     Transcript:
            //     ${formattedTranscript}

            //     Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            //     - **Communication Skills**: Clarity, articulation, structured responses.
            //     - **Technical Knowledge**: Understanding of key concepts for the role.
            //     - **Problem-Solving**: Ability to analyze problems and propose solutions.
            //     - **Cultural & Role Fit**: Alignment with company values and job role.
            //     - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            //     `,
            // system:
            //     "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
            prompt: `
                คุณเป็นผู้สัมภาษณ์ AI ที่กำลังวิเคราะห์การสัมภาษณ์จำลอง หน้าที่ของคุณคือการประเมินผู้สมัครโดยพิจารณาจากหมวดหมู่ที่มีโครงสร้างชัดเจน วิเคราะห์ให้ละเอียดถี่ถ้วนและละเอียดถี่ถ้วน อย่าผ่อนปรนกับผู้สมัคร หากมีข้อผิดพลาดหรือจุดที่ต้องปรับปรุง ให้ชี้ให้เห็น
                Transcript:
                ${formattedTranscript}

                โปรดให้คะแนนผู้สมัครตั้งแต่ 0 ถึง 100 ในด้านต่อไปนี้ อย่าเพิ่มหมวดหมู่อื่นนอกเหนือจากที่กำหนดไว้:
                - **ทักษะการสื่อสาร**: ความชัดเจน การแสดงออก การตอบสนองที่เป็นโครงสร้าง
                - **ความรู้ทางเทคนิค**: ความเข้าใจในแนวคิดหลักสำหรับบทบาท
                - **การแก้ปัญหา**: ความสามารถในการวิเคราะห์ปัญหาและเสนอแนวทางแก้ไข
                - **ความเหมาะสมทางวัฒนธรรมและบทบาท**: การจัดแนวกับค่านิยมของบริษัทและบทบาทหน้าที่
                - **ความมั่นใจและความชัดเจน**: ความมั่นใจในการตอบสนอง การมีส่วนร่วม และความชัดเจน
                `,
            system:
                "คุณเป็นนักสัมภาษณ์มืออาชีพที่วิเคราะห์การสัมภาษณ์จำลอง หน้าที่ของคุณคือประเมินผู้สมัครตามหมวดหมู่ที่มีโครงสร้างชัดเจน",
            });

        const feedback = await db.collection("feedback").add({
            interviewId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString(),
        });

        return {
            success: true,
            feedbackId: feedback.id,
        }
        
    } catch (error) {
        console.error("Error creating feedback:", error);
        
        return { success: false };
    }

}

export const getFeedbackByInterviewId = async (params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> => {
    const { interviewId, userId } = params;

    const feedback = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];

    return {
        id: feedbackDoc.id,
        ...feedbackDoc.data(),
    } as Feedback;
};