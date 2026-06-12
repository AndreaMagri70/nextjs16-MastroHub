export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center bg-white px-16 py-32 sm:items-start dark:bg-black">
        <h1 className="text-center text-6xl font-bold sm:text-left">
          Welcome to Mastro<span className="text-blue-500">Hub!</span>
        </h1>
        <p className="mt-1 text-center text-2xl sm:text-left">
          Your one-stop solution for managing your Mastodon instances with ease.
        </p>
      </main>
    </div>
  );
}
