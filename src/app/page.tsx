export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* hero section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            Handcrafted Haven
          </h1>

          {/* placeholder - replace with actual hero content */}
          <div className="bg-secondary text-white p-8 rounded-lg min-h-64 flex items-center justify-center">
            <p>Hero card</p>
          </div>
        </div>
      </section>

      {/* featured items */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-primary text-center mb-6">
            Featured Items
          </h2>

          {/* product grid - will map over actual products later */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary text-white p-4 rounded-lg min-h-48 flex items-center justify-center">
              <p>Product 1</p>
            </div>

            <div className="bg-secondary text-white p-4 rounded-lg min-h-48 flex items-center justify-center">
              <p>Product 2</p>
            </div>

            <div className="bg-secondary text-white p-4 rounded-lg min-h-48 flex items-center justify-center">
              <p>Product 3</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
