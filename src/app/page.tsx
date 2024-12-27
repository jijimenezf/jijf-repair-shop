import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center">
      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl">
          <h1>Computer <br/> Repair Shop</h1>
          <address>
            Av. Reforma 222 <br />
            Mexico City
          </address>
          <p>Open Daily: 10 a.m. to 5 p.m.</p>
          <Link
           href="tel: 800 9000 2000"
           className="hover:underline"
          >800 9000 2000</Link>
        </div>
        <br />
        <Link href="/login">Login page</Link>
      </main>
    </div>
  );
}
