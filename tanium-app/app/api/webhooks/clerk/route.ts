import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { instance } from "@/lib/axios-config";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please aa CLERK_WEBHOOK_SECRET from Clerk Dashboard to the .env file"
      );
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error occured", {
        status: 400,
      });
    }

    const eventType = evt.type;

    const data = {
      externalUserId: payload.data.id,
      username: payload.data.username,
      imageUrl: payload.data.image_url,
      firstName: payload.data.first_name,
      lastName: payload.data.last_name,
      emailAddress: payload.data.emailAddresses[0].emailAddress,
    };

    let url: string, method: "post" | "patch" | "delete";

    switch (eventType) {
      case "user.created":
        url = "/api/user";
        method = "post";
        break;
      case "user.updated":
        url = "/api/user";
        method = "patch";
        break;
      case "user.deleted":
        url = `/api/user/${payload.data.id}`;
        method = "delete";
        break;
      default:
        console.error("Unsupported eventType:", eventType);
        return new NextResponse("Unsupported eventType", { status: 400 });
    }

    await instance[method](url, data, {
      headers: {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      },
    });

    return new NextResponse("Success!", { status: 200 });
  } catch (error) {
    console.log("[CLERK_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
