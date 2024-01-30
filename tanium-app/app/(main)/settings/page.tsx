import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { Container } from "@/components/container";
import { getPersonalSettings } from "@/lib/settings-service";

import { PublicizeCard } from "./_components/publicize-card";
import { SubscriptionCard } from "./_components/subscription-card";

const SettingsPage = async () => {
  const { getToken } = auth();

  const [token, settings] = await Promise.all([
    getToken(),
    getPersonalSettings(),
  ]);

  if (!token || !settings) {
    return redirect("sign-in");
  }

  return (
    <div className="bg-black">
      <Container>
        <div className="pt-10 space-y-4">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <PublicizeCard settings={settings} token={token} />
          <SubscriptionCard />
        </div>
      </Container>
    </div>
  );
};

export default SettingsPage;
