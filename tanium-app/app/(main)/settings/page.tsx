import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { Container } from "@/components/container";
import { getPersonalSettings } from "@/lib/settings-service";
import { isPro } from "@/lib/subscription";
import { UserAvatar } from "@/components/user-avatar";
import { getSelf } from "@/lib/user-service";

import { PublicizeCard } from "./_components/publicize-card";
import { SubscriptionCard } from "./_components/subscription-card";

const SettingsPage = async () => {
  const self = await getSelf();

  if (!self) {
    return redirect("sign-in");
  }

  const { getToken } = auth();

  const [token, settings] = await Promise.all([
    getToken(),
    getPersonalSettings(),
  ]);

  if (!token || !settings) {
    return redirect("sign-in");
  }

  const pro = await isPro();

  return (
    <div className="bg-black">
      <Container>
        <div className="pt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <div className="flex items-center justify-center space-x-2">
              <p className="font-semibold text-xs capitalize">
                Logged in as {self.username}
              </p>

              <Link
                href={`/user/${self.id}`}
                className="hover:opacity-75 transition">
                <UserAvatar
                  username={self.username || ""}
                  imageUrl={self.imageUrl}
                />
              </Link>
            </div>
          </div>
          <PublicizeCard settings={settings} token={token} />
          <SubscriptionCard token={token} pro={pro} />
        </div>
      </Container>
    </div>
  );
};

export default SettingsPage;
