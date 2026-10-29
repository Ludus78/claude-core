import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { name, email, phone, subject, projectType, budget, message } = await request.json();

        const response = await prisma.contact.create({
            data: {
                name,
                email,
                phone,
                subject,
                projectType,
                budget,
                message
            }
        });
        console.log(response);

        return Response.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating contact:", error);
        return Response.json({ error: "Failed to create contact" }, { status: 500 });
    }
}