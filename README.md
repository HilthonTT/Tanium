# Tanium - Reddit Clone
Tanium is a full-stack web application that replicates the functionality of Reddit, allowing users to create posts, join communities, and engage in discussions. The application supports upvoting and downvoting of posts, providing a dynamic and interactive user experience.


## Features
User Authentication: Utilizing Clerk for seamless and secure authentication, Tanium ensures a smooth user onboarding process.

Post Creation and Interaction: Users can create posts, share content, and engage in discussions. The upvoting and downvoting system allows the community to curate and prioritize content.

Community Creation: Users can join existing communities or create their own, fostering a diverse range of discussions and interests.

Subscription Model: Tanium integrates with Stripe to offer subscription-based premium features, enhancing the overall user experience.

Database Management: Microsoft Express SQL is used for efficient and reliable data storage, ensuring the scalability and reliability of the application.

Caching with Redis: Redis is employed for caching to optimize performance and reduce latency, enhancing the overall responsiveness of the application.

## Tech Stack
Frontend: Built with NEXTJS, a React framework that enables server-side rendering and seamless client-side navigation.

Backend: Powered by ASP.NET Core Web API, providing a robust and scalable backend infrastructure.

Database: Leveraging Microsoft Express SQL, Tanium ensures efficient data storage and retrieval.

Authentication: Clerk is used for user authentication, ensuring a secure and user-friendly experience.

Caching: Redis is employed for caching to optimize data retrieval and enhance overall application performance.

Subscription Handling: Integration with Stripe allows Tanium to offer premium subscription features.

## Getting Started

1. Clone the repository
```bash 
  git clone https://github.com/HilthonTT/Tanium.git
```

3. Install dependencies

```bash
  cd tanium-app 
  npm install
  cd TaniumApi.Library
  dotnet restore
  cd TaniumApi
  dotnet restore
```

3.1 ASP.NET Env variables
Make sure to replace placeholders (<YOUR-...>) with your actual configuration values. In you ASP.NET Web API appsettings.json

```json
{
  "ConnectionStrings": {
    "Default": "<YOUR-CONNECTIONSTRING>",
    "Redis": "<YOUR-REDIS-CONNECTIONSTRING>"
  },
  "Clerk": {
    "SecretKey": "<YOUR-CLERK-SECRET-KEY>",
    "Authority": "<YOUR-CLERK-FRONT-END-API-URL>",
    "AuthorizedParty": "<YOUR-FRONTEND-URL>",
    "WebhookSecret": "<YOUR-WEBHOOK-SECRET>"
  },
  "AllowedOrigins": {
    "Url": "<YOUR-ALLOWED_ORIGIN-BASE-URL>"
  },
  "Stripe": {
    "WebhookSecret": "<YOUR-STRIPE-WEBHOOk-SECRET-KEY>",
    "SecretKey": "<YOUR-STRIPE-SECRET-KEY>"
  }
}
```

3.2 NEXTJS Env variables
Ensure to replace placeholders (<YOUR-...>) with your actual configuration values. The NEXT_PUBLIC_API_URL should match the base URL of your ASP.NET Core backend.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_API_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
CLERK_WEBHOOK_SECRET=
```

## Launching the app

Launch a terminal
```bash
cd tanium-app
npm run dev
```

Launch another terminal
```bash 
cd TaniumApi
dotnet run
```

## Demonstration


![image](https://github.com/HilthonTT/Tanium/assets/118371200/c947c87e-298b-4f13-8163-02526b7bac93)


![image](https://github.com/HilthonTT/Tanium/assets/118371200/8da3988c-7192-410f-a814-eae90697ac54)


![image](https://github.com/HilthonTT/Tanium/assets/118371200/aa929ca9-41bf-412c-add1-ffd6c39bca31)




