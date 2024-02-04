import { ServerIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center space-y-2">
        <ServerIcon className="animate-spin w-8 h-8" />
        <h1 className="text-muted-foreground font-semibold">Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;
