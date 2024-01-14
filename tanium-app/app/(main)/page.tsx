import { getSelf } from "@/lib/user-service";

const MainPage = async () => {
  const self = await getSelf();

  return <div>Main Page</div>;
};

export default MainPage;
