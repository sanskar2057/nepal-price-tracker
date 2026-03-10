import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Find the <span className="text-primary">Cheapest</span> Prices in Nepal
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Compare real-time prices across Daraz, Hamrobazar and more Nepali marketplaces — save money on phones, laptops & electronics.
        </p>

        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <Input
            type="search"
            placeholder="Search phones, laptops, earbuds... (e.g. iPhone 15 Pro Max)"
            className="h-12 text-lg"
          />
          <Button size="lg" className="h-12 px-8">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-8 text-center md:text-left">
          Explore Popular Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {["Phones", "Laptops", "Earbuds", "Smartwatches", "Appliances"].map((category) => (
            <Card
              key={category}
              className="hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">📱</div> {/* placeholder – later use real icons */}
                <h3 className="font-medium text-lg">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}